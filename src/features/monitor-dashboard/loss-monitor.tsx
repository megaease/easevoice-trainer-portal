import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Loss {
  step: number
  loss: number
}

interface LossMonitorProps {
  losses: Loss[]
  taskName: string
  status: string
}

function LossDetail({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className='flex justify-between text-sm'>
      <span>{label}</span>
      <span className='font-semibold'>{value}</span>
    </div>
  )
}

export function LossMonitor({ losses, taskName, status }: LossMonitorProps) {
  if (losses.length === 0) {
    return <div>No loss data available</div>
  }

  const currentLoss = losses[losses.length - 1].loss
  const averageLoss =
    losses.reduce((sum, loss) => sum + loss.loss, 0) / losses.length
  const maxLoss = Math.max(...losses.map((loss) => loss.loss))

  return (
    <Card className='w-full shadow-none border-none '>
      <CardHeader className='px-0'>
        <CardTitle>Loss</CardTitle>
      </CardHeader>
      <CardContent className='px-0'>
        <div className='space-y-4'>
          <LossDetail label='任务名称' value={taskName} />
          <LossDetail label='任务状态' value={status} />
          <LossDetail label='Current Loss' value={currentLoss.toFixed(3)} />
          <LossDetail label='Average Loss' value={averageLoss.toFixed(3)} />
          <LossDetail label='Max Loss' value={maxLoss.toFixed(3)} />
          <LossDetail label='Steps' value={losses.length} />
        </div>
      </CardContent>
    </Card>
  )
}
