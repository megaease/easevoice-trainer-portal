import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import DataProcessForm from './data-process-form'

export default function DataProcess() {
  return (
    <div className='h-full pb-[100px]'>
      <DataProcessForm />
      {/* <ResizablePanelGroup className='w-full' direction='horizontal'>
        <ResizablePanel minSize={0} maxSize={70} defaultSize={60}>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <ScrollArea className='h-full'>
            <AudioTextEditingList />
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup> */}
    </div>
  )
}
