import { useMutation, useQuery } from '@tanstack/react-query'
import sessionApi from '@/apis/session'
import voiceclone from '@/apis/voiceclone'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { TaskCard } from './TaskCard'

const SessionManagement = () => {
  const {
    data: sessionInfo,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      return sessionApi.getSessionInfo()
    },
    refetchInterval: 5000,
  })

  const stopSessionMutation = useMutation({
    mutationFn: voiceclone.stopVoiceCloneService,
    onSuccess: () => {
      toast.success('声音克隆服务已经停止')
      refetch()
    },
    onError: (error) => {
      toast.error((error as any)?.response?.data?.detail || error.message)
    },
  })
  if (isError) return null
  return (
    <TaskCard
      taskName={sessionInfo?.data.task_name}
      status={sessionInfo?.data.status as 'Running' | 'Completed' | 'Error'}
      error={sessionInfo?.data.error}
      onStop={() => stopSessionMutation.mutate()}
      isPending={stopSessionMutation.isPending}
    />
  )
}

export default SessionManagement
