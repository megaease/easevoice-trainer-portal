import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import FileManager from '../../components/file-manager'

export default function ModelTraining() {
  return (
    <div className='h-full rounded-sm'>
      <ResizablePanelGroup
        direction='horizontal'
        className='h-full items-stretch border rounded'
      >
        <ResizablePanel minSize={20} maxSize={70} defaultSize={50}>
          <ScrollArea className='h-full'>1</ScrollArea>
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
