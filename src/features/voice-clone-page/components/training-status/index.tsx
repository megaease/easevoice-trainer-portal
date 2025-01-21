import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { Spinner } from '@/components/ui/Spinner'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface TrainingStep {
  label: string
  status: 'pending' | 'in-progress' | 'completed' | 'error'
}

interface TrainingStatusProps {
  steps: TrainingStep[]
  currentStep: number
  progress: number
  status: 'in-progress' | 'completed' | 'error'
}

export default function TrainingStatus({
  steps = [
    { label: '选择模型', status: 'completed' },
    { label: '声音克隆', status: 'in-progress' },
    { label: '训练完成', status: 'pending' },
  ],
  currentStep = 1,
  progress = 45,
  status = 'in-progress',
}: TrainingStatusProps) {
  return (
    <div className='p-4'>
      <Card className='shadow-none border-none'>
        <CardContent className='p-4 space-y-4'>
          <div className='flex items-center justify-between'>
            <h3 className='font-medium'>合成进度</h3>
            <Badge
              variant={
                status === 'completed'
                  ? 'default'
                  : status === 'error'
                    ? 'destructive'
                    : 'secondary'
              }
              className='capitalize'
            >
              {status === 'completed'
                ? '已完成'
                : status === 'error'
                  ? '错误'
                  : '进行中'}
              <Spinner className='h-4 w-4 ml-2' />
            </Badge>
          </div>

          <Progress value={progress} className='h-2' />

          <div className='space-y-2'>
            {steps.map((step, index) => (
              <div key={index} className='flex items-center gap-2 text-sm'>
                {step.status === 'completed' ? (
                  <CheckCircle2 className='h-4 w-4 text-green-500' />
                ) : step.status === 'error' ? (
                  <XCircle className='h-4 w-4 text-red-500' />
                ) : step.status === 'in-progress' ? (
                  <Loader2 className='h-4 w-4 text-blue-500 animate-spin' />
                ) : (
                  <div className='h-4 w-4 rounded-full border border-gray-300' />
                )}
                <span
                  className={
                    step.status === 'completed'
                      ? 'text-green-500'
                      : step.status === 'error'
                        ? 'text-red-500'
                        : step.status === 'in-progress'
                          ? 'text-blue-500'
                          : 'text-gray-500'
                  }
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
