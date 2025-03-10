import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import namespaceApi from '@/apis/namespace'
import { useNamespaceStore } from '@/stores/namespaceStore'
import { cn } from '@/lib/utils'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
  beforeLoad: async () => {
    const currentNamespace = useNamespaceStore.getState().currentNamespace
    const res = await namespaceApi.getNamespaceRoot()
    const namespaceRoot = res?.data
    if (!currentNamespace || (namespaceRoot && !namespaceRoot.setOnce)) {
      throw redirect({ to: '/' })
    }
  },
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
