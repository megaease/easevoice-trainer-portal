import * as React from 'react'
import { useMutation } from '@tanstack/react-query'
import namespaceApi from '@/apis/namespace'
import { ChevronsUpDown, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { useNamespaceStore } from '@/stores/namespaceStore'
import { getRandomIconByName } from '@/lib/randomIcon'
import { useNamespaceList } from '@/hooks/use-namespace-list'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

export function NamespaceSwitch() {
  const { isMobile } = useSidebar()
  const { currentNamespace, setCurrentNamespace } = useNamespaceStore()

  const { namespaces = [], refetch } = useNamespaceList()

  const createNamespaceMutation = useMutation({
    mutationFn: namespaceApi.createNamespace,
    onSuccess: (_, namespace) => {
      toast.success('命名空间创建成功')
      setCurrentNamespace(namespace)
    },
    onSettled: () => {
      refetch()
    },
  })

  const Icon = getRandomIconByName(currentNamespace?.name || '')
  const [newNamespace, setNewNamespace] = React.useState('')
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const handleAddNamespace = async () => {
    if (!newNamespace.trim()) {
      toast.error('命名空间名称不能为空')
      return
    }
    createNamespaceMutation.mutate({ name: newNamespace })
    setIsDialogOpen(false)
  }

  const deleteNamespaceMutation = useMutation({
    mutationFn: namespaceApi.deleteNamespace,
    onSuccess: (_, namespaceId) => {
      toast.success('命名空间删除成功')
      if (currentNamespace?.namespaceID === namespaceId) {
        setCurrentNamespace(null)
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onSettled: () => {
      refetch().then(() => {})
    },
  })

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
                  {currentNamespace?.name || null}
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
              const Icon = getRandomIconByName(namespace?.name || '')
              return (
                <DropdownMenuItem
                  key={namespace?.name}
                  onClick={() => setCurrentNamespace(namespace)}
                  className='gap-2 p-2 truncate'
                >
                  <div className='flex size-6 items-center justify-center rounded-sm border'>
                    <Icon className='size-4' />
                  </div>
                  {namespace?.name}
                  <DropdownMenuShortcut
                    onClick={(e) => {
                      e.stopPropagation()
                      if (namespaces.length === 1) {
                        toast.error('至少需要一个命名空间')
                        return
                      }
                      deleteNamespaceMutation.mutate(namespace.namespaceID)
                    }}
                  >
                    <X className='size-4' />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-2 p-2'>
              <div
                className='flex items-center justify-center w-full h-full gap-2'
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className='size-4' />
                <div className='font-medium text-muted-foreground'>
                  添加命名空间
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加命名空间</DialogTitle>
              <DialogDescription>输入新的命名空间名称</DialogDescription>
            </DialogHeader>
            <Input
              value={newNamespace}
              onChange={(e) => setNewNamespace(e.target.value)}
              placeholder='命名空间名称'
            />
            <DialogFooter>
              <Button onClick={handleAddNamespace}>添加</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
