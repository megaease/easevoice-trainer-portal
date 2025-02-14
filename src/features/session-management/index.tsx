import type React from 'react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import sessionApi from '@/apis/session'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'

type LastSessionData = {
  task_name: string
  status: string
  error: string | null
  pid?: number
  total_steps?: number
  progress?: number
  current_step?: number
  current_step_description?: string
}

type CurrentSessionData = LastSessionData

interface SessionData {
  current_session: CurrentSessionData
  last_session: LastSessionData
}

const SessionManagement: React.FC = () => {
  const [showLastSession, setShowLastSession] = useState(false)
  const { data, isLoading, isError } = useQuery<SessionData>({
    queryKey: ['session'],
    queryFn: () => {
      return sessionApi.getSessionInfo().then((response) => response.data)
    },
    refetchInterval: 5000,
  })

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    )
  }

  if (isError) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-center'>
          <AlertCircle className='w-12 h-12 mx-auto text-destructive' />
          <h2 className='mt-2 text-xl font-semibold'>
            Error fetching task status
          </h2>
        </div>
      </div>
    )
  }

  const currentSession = data?.current_session
  const lastSession = data?.last_session

  return (
    <Card className='border-none shadow-none p-4'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          任务管理
          <div className='flex items-center space-x-2'>
            <Switch
              id='show-last-session'
              checked={showLastSession}
              onCheckedChange={setShowLastSession}
            />
            <Label htmlFor='show-last-session'>显示上次任务</Label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showLastSession ? (
          <SessionView session={lastSession} />
        ) : (
          <SessionView session={currentSession} />
        )}
      </CardContent>
    </Card>
  )
}

const SessionView: React.FC<{ session?: LastSessionData }> = ({ session }) => {
  if (!session) {
    return <div>No last session data available</div>
  }

  return (
    <div>
      <h2 className='font-semibold mb-4'>上次任务</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <StatusItem label='任务名称' value={session.task_name} />
        <StatusItem
          label='状态'
          value={<StatusBadge status={session.status} />}
        />
        {session.pid && <StatusItem label='PID' value={session.pid} />}
        {session.total_steps && (
          <StatusItem label='步骤总数' value={session.total_steps} />
        )}
        {session.current_step && (
          <StatusItem label='当前步骤' value={session.current_step} />
        )}
      </div>
      {session.progress !== undefined && (
        <div className='mt-6'>
          <label className='text-sm font-medium'>进度</label>
          <Progress value={session.progress} className='mt-2' />
          <p className='text-right text-sm text-muted-foreground mt-1'>
            {session.progress}%
          </p>
        </div>
      )}
      {session.current_step_description && (
        <div className='mt-6'>
          <label className='text-sm font-medium'>详情</label>
          <p className='mt-1 text-muted-foreground'>
            {session.current_step_description}
          </p>
        </div>
      )}
      {session.error && (
        <div className='mt-6 p-4 bg-destructive/10 rounded-md'>
          <div className='flex items-center'>
            <AlertCircle className='w-5 h-5 text-destructive mr-2' />
            <h3 className='font-semibold text-destructive'>Error</h3>
          </div>
          <p className='mt-1 text-destructive'>{session.error}</p>
        </div>
      )}
    </div>
  )
}

const StatusItem: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div>
    <label className='text-sm font-medium'>{label}</label>
    <p className='mt-1 text-muted-foreground'>{value}</p>
  </div>
)

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let color = 'default'
  switch (status.toLowerCase()) {
    case 'running':
      color = 'blue'
      break
    case 'completed':
      color = 'green'
      break
    case 'error':
      color = 'red'
      break
    // Add more cases as needed
  }
  return (
    <Badge variant={color as 'default' | 'secondary' | 'destructive'}>
      {status}
    </Badge>
  )
}

export default SessionManagement
