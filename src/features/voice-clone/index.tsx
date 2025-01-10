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
import SelectModelForm from './components/select-model-form'
import TrainingStatus from './components/training-status'

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
            <ResizablePanel minSize={20} maxSize={70} defaultSize={50}>
              <ScrollArea className='h-full'>
                <SelectModelForm />
              </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <ResizablePanelGroup
                direction='vertical'
                className='h-full items-stretch'
              >
                <ResizablePanel minSize={40} maxSize={80} defaultSize={80}>
                  <div className='h-full'>
                    <FileManager />
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel>
                  <TrainingStatus
                    steps={
                      [
                        // { label: '选择模型', status: 'completed' },
                        // { label: '声音克隆', status: 'in-progress' },
                        // { label: '训练完成', status: 'pending' },
                      ]
                    }
                    currentStep={1}
                    progress={45}
                    status='in-progress'
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </Main>
    </>
  )
}
