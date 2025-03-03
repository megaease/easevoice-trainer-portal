import { useQuery } from '@tanstack/react-query'
import sessionApi from '@/apis/session'

export const useCurrentSessionAutoRefresh = () => {
  const currentSession = useQuery({
    queryKey: ['currentSession', 'loss_monitor'],
    queryFn: async () => {
      const res = await sessionApi.getCurrentSession()
      return res.data
    },
    refetchInterval: 5000,
  })
  return currentSession
}
