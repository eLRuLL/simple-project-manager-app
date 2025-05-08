import React from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'
import { useProjects } from '../hooks/useProjects'
import { Project } from '../client'
import { ProjectCard } from './ProjectCard'

interface Props {
  draftProject?: Project | null
  onSaveDraft?: (project: Project) => void
  onCancelDraft?: () => void
}

export const ProjectList = ({
  draftProject,
  onSaveDraft,
  onCancelDraft,
}: Props) => {
  const { projects, isLoading, updateProject } = useProjects()

  const handleProjectUpdate = async (updatedProject: Project) => {
    try {
      await updateProject(updatedProject)
    } catch (error) {
      console.error('Failed to update project:', error)
    }
  }

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View className="flex-1">
      <FlatList
        className="bg-black rounded-xl m-3"
        data={
          draftProject ? [draftProject, ...(projects ?? [])] : projects ?? []
        }
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onSaveDraft={onSaveDraft}
            onCancelDraft={onCancelDraft}
            onPress={() => {
              // Handle project press
              console.log('Project pressed:', item.id)
            }}
            startInEditMode={item.id === draftProject?.id}
            onUpdate={handleProjectUpdate}
          />
        )}
        keyExtractor={(item: Project) => item.id ?? ''}
        contentContainerStyle={{ padding: 16, gap: 16 }}
      />
    </View>
  )
}
