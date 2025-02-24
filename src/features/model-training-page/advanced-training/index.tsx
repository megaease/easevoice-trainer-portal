import { useEffect, useState } from 'react'
import { Link, Outlet, useMatchRoute } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type Props = {
  className?: string
}

export default function AdvancedTraining({ className, ...props }: Props) {
  const matchRoute = useMatchRoute()
  const [currentTab, setCurrentTab] = useState('dataProcess')

  useEffect(() => {
    if (matchRoute({ to: '/model-training/advanced-mode/step1' })) {
      setCurrentTab('dataProcess')
    } else if (matchRoute({ to: '/model-training/advanced-mode/step2' })) {
      setCurrentTab('modelTraining')
    }
  })

  return (
    <Tabs
      className='h-full py-2'
      value={currentTab}
      onValueChange={setCurrentTab}
    >
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
            <Link to='/model-training/advanced-mode/step1'>
              <TabsTrigger value='dataProcess'>1. 前置数据处理</TabsTrigger>
            </Link>
            <Link to='/model-training/advanced-mode/step2'>
              <TabsTrigger value='modelTraining'>2. 训练模型</TabsTrigger>
            </Link>
          </TabsList>
        </nav>
      </div>
      <Separator className='mt-4' />
      <ScrollArea className='h-full'>
        <Outlet />
      </ScrollArea>
    </Tabs>
  )
}
