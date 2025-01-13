import React from 'react'
import { Link, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DataProcess from './data-process'
import BasicTrainingForm from './fine-tuning-training'
import FineTuningTraining from './fine-tuning-training'

type Item = {
  title: string
  id: number
  icon: React.ReactNode
}

type Props = {
  className?: string
}

const items: Item[] = [
  {
    id: 1,
    title: '基础模式',
    icon: <Link />,
  },
  { id: 2, title: '高级模式', icon: <Link /> },
]

export default function AdvancedTraining({ className, ...props }: Props) {
  return (
    <div className='p-4'>
      <Tabs defaultValue='dataProcess'>
        <div className='flex justify-between items-center gap-2'>
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
        <TabsContent value='dataProcess'>
          <DataProcess />
        </TabsContent>
        <TabsContent value='modelTraining'>
          <FineTuningTraining />
        </TabsContent>
      </Tabs>
    </div>
  )
}
