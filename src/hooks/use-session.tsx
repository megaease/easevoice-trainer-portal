import { useQuery } from '@tanstack/react-query'
import sessionApi from '@/apis/session'

type TaskStatus = 'Completed' | 'Running' | 'Failed'

export interface Task {
  uuid: string
  task_name: string
  status: TaskStatus
  error: string | null // 只有非 Running 时才有信息
  message: string // 只有非 Running 时才有信息
  data: Record<string, any> // 处理过程的详细数据
}

export interface monitorMetrics {
  [uuid: string]: string
}
export interface Tasks {
  [uuid: string]: Task | monitorMetrics
}
export function useSession() {
  const query = useQuery<Tasks>({
    queryKey: ['session'],
    queryFn: () => {
      return sessionApi.getSessionInfo().then((response) => response.data)
    },
    refetchInterval: 5000,
  })
  return query
}
