import { Cpu, HardDrive, Zap } from 'lucide-react'
import { useSession } from '@/hooks/use-session'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MonitoringData {
  gpu_percentage: string
  memory_allocated_percentage: string
  cpu_percentage: string
}

export default function MonitoringDashboard() {
  const session = useSession()
  if (session.isLoading) {
    return null
  }
  const data = session?.data?.monitor_metrics || {
    gpu_percentage: '0%',
    memory_allocated_percentage: '0.00%',
    cpu_percentage: '0%',
  }

  return (
    <Card className='w-full bg-background shadow-none border-none'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-lg font-semibold'>监控信息</CardTitle>
      </CardHeader>
      <CardContent className='pt-2'>
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <Zap className='h-5 w-5 text-yellow-500' />
              <span className='font-medium'>GPU:</span>
            </div>
            <span className='text-lg font-bold'>{data.gpu_percentage}</span>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <HardDrive className='h-5 w-5 text-blue-500' />
              <span className='font-medium'>Memory:</span>
            </div>
            <span className='text-lg font-bold'>
              {data.memory_allocated_percentage}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <Cpu className='h-5 w-5 text-green-500' />
              <span className='font-medium'>CPU:</span>
            </div>
            <span className='text-lg font-bold'>{data.cpu_percentage}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
