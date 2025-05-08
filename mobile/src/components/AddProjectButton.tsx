import React from 'react'
import { Pressable, Text } from 'react-native'

interface Props {
  onPress: () => void
}

export const AddProjectButton: React.FC<Props> = ({ onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      className="absolute bottom-16 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg active:opacity-80 z-50"
      style={{ elevation: 5 }}
    >
      <Text className="text-white text-3xl font-bold">+</Text>
    </Pressable>
  )
}
