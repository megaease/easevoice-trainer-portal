import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DataProcess from './data-process'
import FineTuningTraining from './fine-tuning-training'

type Props = {
  className?: string
}

export default function AdvancedTraining({ className, ...props }: Props) {
  return (
    <Tabs defaultValue='dataProcess' className='h-full py-2'>
      <div className='flex justify-between items-center gap-2  px-4 '>
        <h2 className='text-lg font-semibold'>高级模式</h2>
        <nav
          className={cn(
            'flex py-1 space-x-2 lg:space-x-0 lg:space-y-1',
            className
          )}
          {...props}
        >
          <TabsList>
            <TabsTrigger value='dataProcess'>前置数据处理</TabsTrigger>
            <TabsTrigger value='modelTraining'>训练模型</TabsTrigger>
          </TabsList>
        </nav>
      </div>
      <Separator className='mt-4' />
      <TabsContent value='dataProcess' className='h-full'>
        <ScrollArea className='h-full'>
          <DataProcess />
        </ScrollArea>
      </TabsContent>

      <TabsContent value='modelTraining' className='h-full'>
        <ScrollArea className='h-full'>
          <FineTuningTraining />
        </ScrollArea>
      </TabsContent>
    </Tabs>
  )
}
