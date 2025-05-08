import React, { useState } from 'react'
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native'
import { ProjectList } from '../components/ProjectList'
import { AddProjectButton } from '../components/AddProjectButton'
import { useProjects } from '../hooks/useProjects'
import { Project } from '../client'

const HomeScreen = () => {
  const { createProject } = useProjects()
  const [draftProject, setDraftProject] = useState<Project | null>(null)

  const handleAddProject = async () => {
    setDraftProject({
      id: 'draft-' + Date.now(),
      name: 'New Project',
      description: 'Add your description here',
      status: 'Backlog',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  const handleSaveProject = async (project: Project) => {
    try {
      if (project.id.startsWith('draft-')) {
        await createProject({
          name: project.name,
          description: project.description ?? '',
          status: project.status,
          assignee_id: project.assignee?.id,
        })
      }
    } catch (error) {
      console.error('Error saving project:', error)
    } finally {
      setDraftProject(null)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView className="flex-1">
        <ProjectList
          draftProject={draftProject}
          onSaveDraft={handleSaveProject}
          onCancelDraft={() => setDraftProject(null)}
        />
      </ScrollView>
      <AddProjectButton onPress={handleAddProject} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
})

export default HomeScreen
