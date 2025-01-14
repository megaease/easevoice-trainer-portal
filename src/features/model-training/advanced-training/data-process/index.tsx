import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import BasicProcessForm from '../../basic-training/basic-training-form'
import AudioTextEditingList from './audio-text-editing-list'

export default function DataProcess() {
  return (
    <div className='h-full'>
      <ResizablePanelGroup className='w-full' direction='horizontal'>
        <ResizablePanel minSize={0} maxSize={50} defaultSize={30}>
          <BasicProcessForm />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <ScrollArea className='h-full'>
            <AudioTextEditingList />
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
