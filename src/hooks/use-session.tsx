import { useQuery } from '@tanstack/react-query'
import sessionApi from '@/apis/session'

type TaskStatus = 'Completed' | 'Running' | 'Failed'

interface Task {
  uuid: string
  task_name: string
  status: TaskStatus
  error: string | null
  message: string
  data: Record<string, any> | { output_path: string }
  request: Record<string, any>
}
export interface EasyModeTask {
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
  [uuid: string]: Task | MonitorMetrics | EasyModeTask
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
