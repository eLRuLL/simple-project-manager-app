import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './global.css'
import HomeScreen from './src/screens/HomeScreen'
import { NetworkStatusIndicator } from './src/components/NetworkStatusIndicator'
import { SafeAreaView, StyleSheet } from 'react-native'
const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={styles.container}>
        <NetworkStatusIndicator />
        <HomeScreen />
      </SafeAreaView>
    </QueryClientProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
})
