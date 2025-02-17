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
    </div>
  )
}
