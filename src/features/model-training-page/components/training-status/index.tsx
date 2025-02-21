import type React from 'react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import trainingApi from '@/apis/training'
import { AlertCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface SessionData {
  task_name: string
  status: string
  error: string | null
  pid: number
  total_steps: number
  progress: number
  current_step: number
  current_step_description: string
}

interface TrainingData {
  current_session: SessionData
  last_session: SessionData
}

const TrainingStatus = () => {
  const [showLastSession, setShowLastSession] = useState(false)
  const { data, isLoading, isError } = useQuery<TrainingData>({
    queryKey: ['taskStatus'],
    queryFn: async () => {
      const response = await trainingApi.getTrainingStatus()
      return response.data
    },
    refetchInterval: 5000,
  })

  // if (isLoading) {
  //   return (
  //     <div className='flex items-center justify-center h-screen'>
  //       <Loader2 className='w-8 h-8 animate-spin text-primary' />
  //     </div>
  //   )
  // }

  // if (isError) {
  //   return (
  //     <div className='flex items-center justify-center h-screen'>
  //       <div className='text-center'>
  //         <AlertCircle className='w-12 h-12 mx-auto text-destructive' />
  //         <h2 className='mt-2 text-xl font-semibold'>
  //           Error fetching task status
  //         </h2>
  //       </div>
  //     </div>
  //   )
  // }

  const sessionData = data?.last_session
  if (!sessionData) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-center'>
          <AlertCircle className='w-12 h-12 mx-auto text-warning' />
          <h2 className='mt-2 text-xl font-semibold'>
            No session data available
          </h2>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='bg-card rounded-lg p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>Task: {sessionData.task_name}</h1>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <StatusItem label='Status' value={sessionData.status} />
          <StatusItem label='PID' value={sessionData.pid} />
          <StatusItem label='Total Steps' value={sessionData.total_steps} />
          <StatusItem label='Current Step' value={sessionData.current_step} />
        </div>
        <div className='mt-6'>
          <label className='text-sm font-medium'>Progress</label>
          <Progress value={sessionData.progress} className='mt-2' />
          <p className='text-right text-sm text-muted-foreground mt-1'>
            {sessionData.progress}%
          </p>
        </div>
        <div className='mt-6'>
          <label className='text-sm font-medium'>
            Current Step Description
          </label>
          <p className='mt-1 text-muted-foreground'>
            {sessionData.current_step_description}
          </p>
        </div>
        {sessionData.error && (
          <div className='mt-6 p-4 bg-destructive/10 rounded-md'>
            <div className='flex items-center'>
              <AlertCircle className='w-5 h-5 text-destructive mr-2' />
              <h3 className='font-semibold text-destructive'>Error</h3>
            </div>
            <p className='mt-1 text-destructive'>{sessionData.error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

const StatusItem: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div>
    <label className='text-sm font-medium'>{label}</label>
    <p className='mt-1 text-muted-foreground'>{value}</p>
  </div>
)

export default TrainingStatus
