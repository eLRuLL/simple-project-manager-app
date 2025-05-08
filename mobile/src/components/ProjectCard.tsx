import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Pressable, Image, TextInput, Modal } from 'react-native'
import { Project, User } from '../client'
import { useUsers } from '../hooks/useUsers'

type ProjectStatus = 'Backlog' | 'To Do' | 'In Progress' | 'Completed'

interface ProjectCardProps {
  project: Project
  onPress?: () => void
  onUpdate?: (project: Project) => void
  onCancel?: () => void
  onSaveDraft?: (project: Project) => void
  onCancelDraft?: () => void
  startInEditMode?: boolean
}

const SelectionButton = ({
  label,
  value,
  onPress,
}: {
  label: string
  value: string
  onPress: () => void
}) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center justify-between bg-gray-700 p-3 rounded-lg mb-2"
  >
    <Text className="text-white">{label}</Text>
    <Text className="text-gray-400">{value}</Text>
  </Pressable>
)

export const ProjectCard = ({
  project,
  onPress,
  onUpdate,
  onCancel,
  onSaveDraft,
  onCancelDraft,
  startInEditMode = false,
}: ProjectCardProps) => {
  const [isEditing, setIsEditing] = useState(startInEditMode)
  const [editedName, setEditedName] = useState(project.name)
  const [editedDescription, setEditedDescription] = useState(
    project.description ?? '',
  )
  const [editedStatus, setEditedStatus] = useState<ProjectStatus>(
    project.status ?? 'Backlog',
  )
  const [editedAssigneeId, setEditedAssigneeId] = useState<string | undefined>(
    project.assignee?.id,
  )
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showAssigneeModal, setShowAssigneeModal] = useState(false)
  const nameInputRef = useRef<TextInput>(null)

  const { data: users, isLoading: isLoadingUsers } = useUsers()

  useEffect(() => {
    if (startInEditMode && nameInputRef.current) {
      // Small delay to ensure the input is mounted
      setTimeout(() => {
        nameInputRef.current?.focus()
      }, 100)
    }
  }, [startInEditMode])

  const getStatusClasses = (status: ProjectStatus): string => {
    switch (status) {
      case 'Backlog':
        return 'bg-backlog'
      case 'To Do':
        return 'bg-todo'
      case 'In Progress':
        return 'bg-inProgress'
      case 'Completed':
        return 'bg-completed'
      default:
        return 'bg-backlog'
    }
  }

  const statusClasses = getStatusClasses(editedStatus)

  const handlePress = () => {
    if (isEditing) return
    setIsEditing(true)
    onPress?.()
  }

  const handleSave = () => {
    const updatedProject = {
      ...project,
      name: editedName,
      description: editedDescription,
      status: editedStatus,
      assignee: users?.find((user) => user.id === editedAssigneeId),
    }

    if (project.id.startsWith('draft-')) {
      onSaveDraft?.(updatedProject)
    } else if (onUpdate) {
      onUpdate(updatedProject)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    if (project.id.startsWith('draft-')) {
      onCancelDraft?.()
    } else {
      setEditedName(project.name)
      setEditedDescription(project.description ?? '')
      setEditedStatus(project.status ?? 'Backlog')
      setEditedAssigneeId(project.assignee?.id)
      setIsEditing(false)
      onCancel?.()
    }
  }

  const renderStatusModal = () => (
    <Modal
      visible={showStatusModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowStatusModal(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-dark rounded-t-xl p-4">
          <Text className="text-white text-lg font-semibold mb-4">
            Select Status
          </Text>
          {(
            ['Backlog', 'To Do', 'In Progress', 'Completed'] as ProjectStatus[]
          ).map((status) => (
            <Pressable
              key={status}
              onPress={() => {
                setEditedStatus(status)
                setShowStatusModal(false)
              }}
              className="flex-row items-center justify-between bg-gray-700 p-3 rounded-lg mb-2"
            >
              <Text className="text-white">{status}</Text>
              {editedStatus === status && (
                <Text className="text-primary">✓</Text>
              )}
            </Pressable>
          ))}
          <Pressable
            onPress={() => setShowStatusModal(false)}
            className="bg-gray-700 p-3 rounded-lg mt-2"
          >
            <Text className="text-white text-center">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )

  const renderAssigneeModal = () => (
    <Modal
      visible={showAssigneeModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowAssigneeModal(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-dark rounded-t-xl p-4">
          <Text className="text-white text-lg font-semibold mb-4">
            Select Assignee
          </Text>
          <Pressable
            onPress={() => {
              setEditedAssigneeId(undefined)
              setShowAssigneeModal(false)
            }}
            className="flex-row items-center justify-between bg-gray-700 p-3 rounded-lg mb-2"
          >
            <Text className="text-white">Unassigned</Text>
            {!editedAssigneeId && <Text className="text-primary">✓</Text>}
          </Pressable>
          {users?.map((user) => (
            <Pressable
              key={user.id}
              onPress={() => {
                setEditedAssigneeId(user.id)
                setShowAssigneeModal(false)
              }}
              className="flex-row items-center justify-between bg-gray-700 p-3 rounded-lg mb-2"
            >
              <View className="flex-row items-center">
                <Image
                  source={{ uri: user.avatar }}
                  className="w-6 h-6 rounded-full mr-2"
                />
                <Text className="text-white">{user.name}</Text>
              </View>
              {editedAssigneeId === user.id && (
                <Text className="text-primary">✓</Text>
              )}
            </Pressable>
          ))}
          <Pressable
            onPress={() => setShowAssigneeModal(false)}
            className="bg-gray-700 p-3 rounded-lg mt-2"
          >
            <Text className="text-white text-center">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )

  if (isEditing) {
    return (
      <Pressable
        onPress={handlePress}
        className="flex flex-col bg-dark rounded-xl p-4"
      >
        <View className="flex-row items-center justify-between mb-4">
          <TextInput
            ref={nameInputRef}
            value={editedName}
            onChangeText={setEditedName}
            className="text-lg font-semibold text-white flex-1 mr-2"
            placeholder="Project name"
            placeholderTextColor="#666"
          />
        </View>
        <View className="flex-row items-center justify-between mb-4">
          <TextInput
            value={editedDescription}
            onChangeText={setEditedDescription}
            className="text-sm text-gray-400 flex-1 mr-2"
            placeholder="Add a description..."
            placeholderTextColor="#666"
            multiline
          />
        </View>
        <View className="mb-4">
          <Text className="text-white mb-2">Status</Text>
          <SelectionButton
            label="Current Status"
            value={editedStatus}
            onPress={() => setShowStatusModal(true)}
          />
        </View>
        <View className="mb-4">
          <Text className="text-white mb-2">Assignee</Text>
          <SelectionButton
            label="Current Assignee"
            value={
              users?.find((u) => u.id === editedAssigneeId)?.name ||
              'Unassigned'
            }
            onPress={() => setShowAssigneeModal(true)}
          />
        </View>
        <View className="flex-row justify-end space-x-2">
          <Pressable
            onPress={handleCancel}
            className="px-4 py-2 rounded-lg bg-gray-700"
          >
            <Text className="text-white">Cancel</Text>
          </Pressable>
          <Pressable
            onPress={handleSave}
            className="px-4 py-2 rounded-lg bg-primary"
          >
            <Text className="text-white">Save</Text>
          </Pressable>
        </View>
        {renderStatusModal()}
        {renderAssigneeModal()}
      </Pressable>
    )
  }

  return (
    <Pressable
      onPress={handlePress}
      className="flex flex-col bg-dark rounded-xl p-2"
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text
          className="text-lg font-semibold text-white flex-1 mr-2"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {project.name}
        </Text>
        <View
          className={`px-2 py-1 rounded-full ${statusClasses} min-w-[80px]`}
        >
          <Text
            className="text-sm font-medium text-white text-center"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {project.status ?? 'Backlog'}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center justify-between">
        <Text
          className="text-sm text-gray-400 flex-1 mr-2"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {project.description}
        </Text>
        {project.assignee?.avatar && (
          <View className="flex-row items-center justify-center">
            <Image
              source={{ uri: project.assignee.avatar }}
              className="w-6 h-6 rounded-full"
            />
          </View>
        )}
      </View>
    </Pressable>
  )
}
