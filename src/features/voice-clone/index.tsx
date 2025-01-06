import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import SelectModelForm from './select-model-form'

export default function VoiceClone() {
  return (
    <div className='h-full border rounded-sm'>
      <ResizablePanelGroup
        direction='horizontal'
        className='h-full items-stretch'
      >
        <ResizablePanel minSize={20} maxSize={80} defaultSize={50}>
          <ScrollArea className='h-full'>
            <SelectModelForm />
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className='p-4'>One</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
