import { Clock, FileCode, Folder, Info } from 'lucide-react'
import { EaseModeTask } from '@/hooks/use-session'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default function ResultStatus({
  result,
}: {
  result?: EaseModeTask | null
}) {
  if (!result) {
    return (
      <Card className='w-full  mx-auto shadow-none'>
        <CardHeader>
          <CardTitle>任务状态</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-center text-muted-foreground'>
            没有正在运行的任务
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='w-full mx-auto shadow-none'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          <span> 任务名称: {result.task_name}</span>
          <span className='text-sm font-normal text-muted-foreground'>
            {result.status}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex items-center space-x-2'>
            <FileCode className='w-4 h-4 text-muted-foreground' />
            <span className='text-sm font-medium'>UUID:</span>
            <span className='text-sm text-muted-foreground'>{result.uuid}</span>
          </div>
          <div className='flex items-center space-x-2'>
            <Clock className='w-4 h-4 text-muted-foreground' />
            <span className='text-sm font-medium'>Created:</span>
            <span className='text-sm text-muted-foreground'>
              {result.created_at}
            </span>
          </div>
        </div>

        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span>进度</span>
            <span>
              {result.current_step} / {result.total_steps}
            </span>
          </div>
          <Progress value={result.progress} className='w-full' />
        </div>

        <div className='space-y-2'>
          <h4 className='text-sm font-medium'>Message</h4>
          <p className='text-sm text-muted-foreground'>{result.message}</p>
        </div>

        <div className='space-y-2'>
          <h4 className='text-sm font-medium'>模型路径</h4>
          <div className='flex items-center space-x-2'>
            <Folder className='w-4 h-4 text-muted-foreground' />
            <span className='text-sm text-muted-foreground'>
              {result.data?.model_path}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
