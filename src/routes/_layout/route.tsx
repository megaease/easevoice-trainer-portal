import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { useNamespaceStore } from '@/stores/namespaceStore'

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
  beforeLoad: () => {
    const currentNamespace = useNamespaceStore.getState().currentNamespace
    if (!currentNamespace) {
      throw redirect({ to: '/' })
    }
  }
})

function RouteComponent() {
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
        <Outlet />
      </div>
    </SidebarProvider>
  )
}
