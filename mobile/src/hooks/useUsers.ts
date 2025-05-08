import { useQuery } from '@tanstack/react-query'
import { User, getApiUsers } from '../client'

const fetchUsers = async (): Promise<User[]> => {
  const response = await getApiUsers()
  if (!response.data) {
    throw new Error('No data received from API')
  }
  return response.data
}

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    retry: 2,
  })
}
