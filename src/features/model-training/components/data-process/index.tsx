import React from 'react'
import { Link } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
    <div className='p-4'>
      <Tabs defaultValue='basic'>
        <div className='flex justify-between items-center gap-2'>
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
        <TabsContent value='account'>
          Make changes to your account here.
        </TabsContent>
        <TabsContent value='password'>Change your password here.</TabsContent>
      </Tabs>
    </div>
  )
}
