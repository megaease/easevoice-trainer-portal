import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ModeToggle } from '@/components/mode-toggle'
import FileManager from '../../components/file-manager'
import SessionManagement from '../session-management'
import AdvancedTraining from './advanced-training'
import BasicTraining from './basic-training'

export default function ModelTraining() {
  return (
    <>
      <Tabs defaultValue='basicMode' className='h-full flex flex-col'>
        <Header>
          <div className='flex items-center gap-3 sm:gap-4 w-full'>
            <div className='flex-1'>
              <TabsList>
                <TabsTrigger value='basicMode'>基础模式</TabsTrigger>
                <TabsTrigger value='advancedMode'>高级模式</TabsTrigger>
              </TabsList>
            </div>
            <ModeToggle />
          </div>
        </Header>
        <Main fixed>
          <div className='h-full rounded-sm'>
            <ResizablePanelGroup
              direction='horizontal'
              className='h-full items-stretch border rounded'
            >
              <ResizablePanel minSize={20} maxSize={70} defaultSize={70}>
                <TabsContent value='basicMode' className='h-full'>
                  <BasicTraining />
                </TabsContent>
                <TabsContent value='advancedMode' className='h-full'>
                  <AdvancedTraining />
                </TabsContent>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel>
                <ResizablePanelGroup
                  direction='vertical'
                  className='h-full items-stretch'
                >
                  <ResizablePanel>
                    <div className='h-full'>
                      <FileManager />
                    </div>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel>
                    <ScrollArea className='h-full w-full'>
                      <SessionManagement />
                    </ScrollArea>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </Main>
      </Tabs>
    </>
  )
}
