import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ModeToggle } from '@/components/mode-toggle'
import SessionManagement from '@/features/session-management'
import FileManager from '../../components/file-manager'
import VoiceCloneForm from './voice-clone-form'

export default function VoiceClone() {
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
                <VoiceCloneForm />
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
                {/* <ResizableHandle withHandle />
                <ResizablePanel>
                  <ScrollArea className='h-full'>
                    <SessionManagement />
                  </ScrollArea>
                </ResizablePanel> */}
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </Main>
    </>
  )
}
