import {
  Mic,
  AlertCircle,
  StopCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TaskCardProps {
  taskName: string
  status: 'Running' | 'Completed' | 'Error'
  error: string | null
  onStop: () => void
  isPending: boolean
}

export function TaskCard({
  taskName,
  status,
  error,
  onStop,
  isPending,
}: TaskCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Running':
        return 'text-green-500'
      case 'Completed':
        return 'text-green-500'
      case 'Error':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Running':
        return <CheckCircle className='h-5 w-5' />
      case 'Completed':
        return <CheckCircle className='h-5 w-5' />
      case 'Error':
        return <AlertCircle className='h-5 w-5' />
      default:
        return null
    }
  }

  return (
    <Card className='w-full border-none shadow-none'>
      <CardHeader>
        <CardTitle>当前任务信息</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='max-w-sm mx-auto'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center space-x-3'>
              <Mic className='h-8 w-8 text-purple-500' />
              <h2 className='text-xl font-semibold'>{taskName}</h2>
            </div>
            <div
              className={`flex items-center space-x-2 ${getStatusColor(status)}`}
            >
              {getStatusIcon(status)}
              <span className='font-semibold text-sm'>
                {status === 'Running' ? '进程已启动' : status}
              </span>
            </div>
          </div>

          {error && (
            <div className='bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4'>
              <p className='font-bold'>Error</p>
              <p>{error}</p>
            </div>
          )}

          {status === 'Running' && (
            <Button variant='destructive' className='w-full' onClick={onStop}>
              {isPending ? (
                <div className='flex items-center gap-1'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  正在停止声音克隆服务
                </div>
              ) : (
                <div className='flex items-center gap-1'>
                  <StopCircle className='h-4 w-4 mr-2' />
                  停止声音克隆服务
                </div>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
