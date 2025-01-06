import { createFileRoute, Outlet } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ModeToggle } from '@/components/mode-toggle'

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
})

export default function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div
        id='content'
        className={cn(
          'max-w-full w-full ml-auto',
          'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
          'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
          'transition-[width] ease-linear duration-200',
          'h-svh flex flex-col',
          'group-data-[scroll-locked=1]/body:h-full',
          'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh'
        )}
      >
        <Header>
          <div className='flex items-center gap-3 sm:gap-4 w-full'>
            <div className='flex-1'></div>
            <ModeToggle />
          </div>
        </Header>
        <Main fixed>
          <Outlet />
        </Main>
      </div>
    </SidebarProvider>
  )
}
