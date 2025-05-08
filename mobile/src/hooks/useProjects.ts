import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Project,
  getApiProjects,
  postApiProjects,
  putApiProjectsById,
  PostApiProjectsData,
} from '../client'
import { useNetworkStatus } from './useNetworkStatus'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'

const OFFLINE_CHANGES_KEY = '@offline_changes'

interface OfflineChange {
  type: 'create' | 'update'
  data: any
  timestamp: number
}

const fetchProjects = async (): Promise<Project[]> => {
  const response = await getApiProjects()
  if (!response.data) {
    throw new Error('No data received from API')
  }
  return response.data
}

const createProject = async (
  project: PostApiProjectsData['body'],
): Promise<Project> => {
  try {
    const response = await postApiProjects({
      body: project,
    })
    if (!response.data) {
      throw new Error('No data received from API')
    }
    return response.data
  } catch (error) {
    console.error('Create error:', error)
    throw error
  }
}

const updateProject = async (project: Project): Promise<Project> => {
  console.log('Updating project:', project)
  const response = await putApiProjectsById({
    body: {
      name: project.name,
      description: project.description ?? '',
      status: project.status,
      assignee_id: project.assignee?.id ?? '',
    },
    path: {
      id: project.id,
    },
  })
  if (!response.data) {
    throw new Error('No data received from API')
  }
  return response.data
}

const saveOfflineChange = async (change: OfflineChange) => {
  try {
    const existingChanges = await AsyncStorage.getItem(OFFLINE_CHANGES_KEY)
    const changes: OfflineChange[] = existingChanges
      ? JSON.parse(existingChanges)
      : []
    changes.push(change)
    await AsyncStorage.setItem(OFFLINE_CHANGES_KEY, JSON.stringify(changes))
  } catch (error) {
    console.error('Error saving offline change:', error)
  }
}

const syncOfflineChanges = async (queryClient: any) => {
  try {
    const changesStr = await AsyncStorage.getItem(OFFLINE_CHANGES_KEY)
    if (!changesStr) return

    const changes: OfflineChange[] = JSON.parse(changesStr)
    const newChanges: OfflineChange[] = []

    for (const change of changes) {
      try {
        if (change.type === 'create') {
          await createProject(change.data)
        } else if (change.type === 'update') {
          await updateProject(change.data)
        }
      } catch (error) {
        console.error('Error syncing change:', error)
        newChanges.push(change)
      }
    }

    if (newChanges.length === 0) {
      await AsyncStorage.removeItem(OFFLINE_CHANGES_KEY)
    } else {
      await AsyncStorage.setItem(
        OFFLINE_CHANGES_KEY,
        JSON.stringify(newChanges),
      )
    }

    // Refresh the projects list
    queryClient.invalidateQueries({ queryKey: ['projects'] })
  } catch (error) {
    console.error('Error syncing offline changes:', error)
  }
}

export const useProjects = () => {
  const queryClient = useQueryClient()
  const { isOnline } = useNetworkStatus()

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    retry: 2,
  })

  // Sync when coming back online
  React.useEffect(() => {
    if (isOnline) {
      syncOfflineChanges(queryClient)
    }
  }, [isOnline])

  const createProjectMutation = useMutation<
    Project,
    Error,
    PostApiProjectsData['body']
  >({
    mutationFn: async (project) => {
      if (isOnline) {
        return createProject(project)
      } else {
        await saveOfflineChange({
          type: 'create',
          data: project,
          timestamp: Date.now(),
        })
        // Return a temporary project object for optimistic update
        return {
          id: 'temp-' + Date.now(),
          name: project.name,
          description: project.description,
          status: project.status,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Project
      }
    },
    onSuccess: (newProject) => {
      queryClient.setQueryData<Project[]>(['projects'], (old) => {
        if (!old) return [newProject]
        return [newProject, ...old]
      })
    },
  })

  const { mutate: updateProjectMutation } = useMutation({
    mutationFn: async (project: Project) => {
      if (isOnline) {
        return updateProject(project)
      } else {
        await saveOfflineChange({
          type: 'update',
          data: project,
          timestamp: Date.now(),
        })
        return project
      }
    },
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(
        ['projects'],
        (oldProjects: Project[] | undefined) => {
          if (!oldProjects) return [updatedProject]
          return oldProjects.map((project) =>
            project.id === updatedProject.id ? updatedProject : project,
          )
        },
      )
    },
  })

  return {
    projects,
    isLoading,
    error,
    createProject: createProjectMutation.mutate,
    isCreating: createProjectMutation.isPending,
    updateProject: updateProjectMutation,
  }
}
