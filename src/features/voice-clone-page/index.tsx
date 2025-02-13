import { useState } from 'react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ModeToggle } from '@/components/mode-toggle'
import FileManager from '../../components/file-manager'
import { CloneResult } from './CloneResult'
import VoiceCloneForm from './components/voice-clone-form'
import useResultStore from './useResultStore'

export default function VoiceClone() {
  const { cloneResult, setCloneResult } = useResultStore()
  return (
    <>
      <Header>
        <div className='flex items-center gap-3 sm:gap-4 w-full'>
          <div className='flex-1'></div>
          <ModeToggle />
        </div>
      </Header>
      <Main fixed>
        <div className='h-full rounded-sm'>
          <ResizablePanelGroup
            direction='horizontal'
            className='h-full items-stretch border rounded'
          >
            <ResizablePanel minSize={20} maxSize={70} defaultSize={66}>
              <ScrollArea className='h-full'>
                <VoiceCloneForm
                  onClone={(result) => {
                    setCloneResult(result)
                  }}
                />
                <CloneResult result={cloneResult} />
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <ResizablePanelGroup
                direction='vertical'
                className='h-full items-stretch'
              >
                <ResizablePanel minSize={40} maxSize={80} defaultSize={60}>
                  <div className='h-full'>
                    <FileManager />
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel>
                  <div className='h-full'>
                    <CloneResult result={cloneResult} />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </Main>
    </>
  )
}
