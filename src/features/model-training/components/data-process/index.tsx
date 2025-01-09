import React from 'react'
import { Link } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BasicProcessForm from './basic-process-form'
import TagProcess from './tag-proccess'

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

export default function DataProcess({ className, ...props }: Props) {
  return (
    <Tabs defaultValue='basic' className='h-full flex flex-col'>
      <div className='flex justify-between items-center gap-2 py-2 px-4'>
        <h2 className='text-lg font-semibold'>前置数据处理</h2>
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
      <Separator />

      <TabsContent value='basic' className='h-full'>
        <div className='h-full'>
          <ResizablePanelGroup className='h-full w-full' direction='horizontal'>
            <ResizablePanel minSize={0} maxSize={50} defaultSize={30}>
              <BasicProcessForm />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <TagProcess />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </TabsContent>
      <TabsContent value='advanced'>TODO</TabsContent>
    </Tabs>
  )
}
