import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import BasicProcessForm from '../../basic-training/basic-training-form'
import TagProcess from './tag-proccess'

export default function DataProcess() {
  return (
    <div className='h-full'>
      <ResizablePanelGroup className='h-full w-full' direction='horizontal'>
        <ResizablePanel minSize={0} maxSize={50} defaultSize={30}>
          <BasicProcessForm />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <TagProcess />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
