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
import DataProcess from './components/data-process'
import Training from './components/training'
import TrainingStatus from './components/training-status'

export default function ModelTraining() {
  return (
    <>
      <Tabs defaultValue='dataProcess' className='h-full flex flex-col'>
        <Header>
          <div className='flex items-center gap-3 sm:gap-4 w-full'>
            <div className='flex-1'>
              <TabsList>
                <TabsTrigger value='dataProcess'>前置数据处理</TabsTrigger>
                <TabsTrigger value='training'>训练模型</TabsTrigger>
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
              <ResizablePanel minSize={20} maxSize={70} defaultSize={50}>
                <TabsContent value='dataProcess'>
                  <ScrollArea className='h-full'>
                    <DataProcess />
                  </ScrollArea>
                </TabsContent>
                <TabsContent value='training'>
                  <ScrollArea className='h-full'>
                    <Training />
                  </ScrollArea>
                </TabsContent>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel>
                <div className='h-full flex flex-col '>
                  <div className='flex-1'>
                    <FileManager />
                  </div>

                  <TrainingStatus
                    steps={[
                      { label: '1. 前置数据处理', status: 'completed' },
                      { label: '2. 训练模型', status: 'in-progress' },
                      { label: '3. 训练完成', status: 'pending' },
                    ]}
                    currentStep={1}
                    progress={45}
                    status='in-progress'
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </Main>
      </Tabs>
    </>
  )
}
