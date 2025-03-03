import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import sessionApi from '@/apis/session'
import { useUUIDStore } from '@/stores/uuidStore'
import { audioProcessesMap } from '@/lib/utils'

export const useCurrentSession = () => {
  const setUUID = useUUIDStore((state) => state.setUUID)
  const currentSession = useQuery({
    queryKey: ['currentSession'],
    queryFn: async () => {
      const res = await sessionApi.getCurrentSession()
      return res.data
    },
    staleTime: 0,
  })

  useEffect(() => {
    if (currentSession.data && currentSession.data.status === 'Running') {
      const uuid = currentSession.data.uuid
      const taskName = currentSession.data.task_name
      if (audioProcessesMap[taskName]) {
        setUUID(audioProcessesMap[taskName], uuid)
      }
    }
  }, [currentSession.data])

  return currentSession
}
