import React from 'react'
import { Link, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BasicTrainingForm from './basic-training-form'

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

export default function Training({ className, ...props }: Props) {
  return (
    <div className='p-4'>
      <Tabs defaultValue='basic'>
        <div className='flex justify-between items-center gap-2'>
          <h2 className='text-lg font-semibold'>训练模型</h2>
          <nav
            className={cn(
              'flex py-1 space-x-2 lg:space-x-0 lg:space-y-1',
              className
            )}
            {...props}
          >
            <TabsList>
              <TabsTrigger value='basic'>基础模式</TabsTrigger>
              <TabsTrigger value='advanced'>高级模式</TabsTrigger>
            </TabsList>
          </nav>
        </div>
        <TabsContent value='basic'>
          <BasicTrainingForm />
        </TabsContent>
        <TabsContent value='advanced'>TODO</TabsContent>
      </Tabs>
    </div>
  )
}
