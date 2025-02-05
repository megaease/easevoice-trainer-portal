import * as React from 'react'
import { ChevronsUpDown, GalleryVerticalEnd, Plus } from 'lucide-react'
import logoSvg from '@/assets/logo.svg'
import { useNamespaceStore } from '@/stores/namespaceStore'
import { getRandomIconByName } from '@/lib/randomIcon'
import { useNamespaceList } from '@/hooks/use-namespace-list'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function NamespaceSwitch() {
  const { isMobile } = useSidebar()
  const { namespaces } = useNamespaceList()
  const { currentNamespace, setCurrentNamespace } = useNamespaceStore()
  const Icon = getRandomIconByName(currentNamespace || '')

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent-foreground text-sidebar-primary-foreground'>
                <Icon className='size-4' />
              </div>

              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {currentNamespace}
                </span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>
              命名空间
            </DropdownMenuLabel>
            {namespaces.map((namespace) => {
              const Icon = getRandomIconByName(namespace)
              return (
                <DropdownMenuItem
                  key={namespace}
                  onClick={() => setCurrentNamespace(namespace)}
                  className='gap-2 p-2'
                >
                  <div className='flex size-6 items-center justify-center rounded-sm border'>
                    <Icon className='size-4' />
                  </div>
                  {namespace}
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-2 p-2'>
              <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                <Plus className='size-4' />
              </div>
              <div className='font-medium text-muted-foreground'>
                添加命名空间
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
