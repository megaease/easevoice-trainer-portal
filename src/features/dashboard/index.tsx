import React from 'react'


import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ModeToggle } from '@/components/mode-toggle'

export default function Dashboard() {
  const [files, setFiles] = React.useState<File[] | null>(null)
  return (
    <div>
      <Header>
        <div className='flex items-center gap-3 sm:gap-4 w-full'>
          <div className='flex-1'></div>
          <ModeToggle />
        </div>
      </Header>
      <Main fixed></Main>
    </div>
  )
}
