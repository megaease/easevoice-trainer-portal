import {
  Link,
  Outlet,
  useMatchRoute,
} from '@tanstack/react-router'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ModeToggle } from '@/components/mode-toggle'
import FileManager from '../../components/file-manager'
import MonitoringDashboard from '../monitor-dashboard'

export default function ModelTraining() {
  const matchRoute = useMatchRoute()

  return (
    <>
      <Tabs
        className='h-full flex flex-col'
        defaultValue={
          matchRoute({ to: '/model-training/advanced-mode' })
            ? 'advancedMode'
            : 'easeMode'
        }
      >
        <Header>
          <div className='flex items-center gap-3 sm:gap-4 w-full'>
            <div className='flex-1'>
              <TabsList>
                <Link to='/model-training/ease-mode'>
                  <TabsTrigger value='easeMode'>基础模式</TabsTrigger>
                </Link>
                <Link to='/model-training/advanced-mode'>
                  <TabsTrigger value='advancedMode'>高级模式</TabsTrigger>
                </Link>
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
                <Outlet />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel>
                <ResizablePanelGroup
                  direction='vertical'
                  className='h-full items-stretch'
                >
                  <ResizablePanel defaultSize={70} minSize={50} maxSize={90}>
                    <div className='h-full'>
                      <FileManager />
                    </div>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel>
                    <ScrollArea className='h-full w-full'>
                      <MonitoringDashboard />
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
