import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import FileManager from './components/file-manager'
import SelectModelForm from './components/select-model-form'

export default function VoiceClone() {
  return (
    <div className='h-full rounded-sm'>
      <ResizablePanelGroup
        direction='horizontal'
        className='h-full items-stretch border rounded'
      >
        <ResizablePanel minSize={20} maxSize={80} defaultSize={50}>
          <ScrollArea className='h-full'>
            <SelectModelForm />
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <ScrollArea className='h-full'>
            <FileManager />
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
