import React from 'react'
import { Text, Animated, View } from 'react-native'
import { useNetworkStatus } from '../hooks/useNetworkStatus'

export const NetworkStatusIndicator = () => {
  const { isOnline } = useNetworkStatus()
  const [animation] = React.useState(new Animated.Value(0))

  React.useEffect(() => {
    if (!isOnline) {
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.spring(animation, {
        toValue: 0,
        useNativeDriver: true,
      }).start()
    }
  }, [isOnline])

  if (isOnline) return null

  return (
    <View
      style={{
        height: isOnline ? 0 : 40,
        overflow: 'hidden',
        backgroundColor: '#facc15', // yellow-500
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {!isOnline && (
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          You are offline. Changes will be saved when you're back online.
        </Text>
      )}
    </View>
  )
}
