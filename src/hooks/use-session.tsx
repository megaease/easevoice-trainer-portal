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
  request: Record<string, any> // 请求的数据
}
export interface EaseModeTask {
  uuid: string
  task_name: string
  request: {
    source_dir: string
  }
  status: string
  created_at: string
  error: null | string
  total_steps: number
  current_step: number
  progress: number
  current_step_description: string
  message: string
  data: {
    model_path: string
  }
}
export interface MonitorMetrics {
  [uuid: string]: string
}
export interface Tasks {
  [uuid: string]: Task | MonitorMetrics | EaseModeTask
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
