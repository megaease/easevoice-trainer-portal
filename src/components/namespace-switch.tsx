import * as React from 'react'
import { set } from 'zod'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog'

export function NamespaceSwitch() {
  const { isMobile } = useSidebar()
  const { currentNamespace, setCurrentNamespace } = useNamespaceStore()

  const { namespaces = [], refetch } = useNamespaceList()
  const [deleteNamespace, setDeleteNamespace] = React.useState<string | null>(
    null
  )
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const createNamespaceMutation = useMutation({
    mutationFn: namespaceApi.createNamespace,
    onSuccess: () => {
      toast.success('工作目录创建成功')
    },
    onError: (error) => {
      toast.error((error as any)?.response?.data?.detail || error.message)
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
      toast.error('工作目录名称不能为空')
      return
    }
    const res = await createNamespaceMutation.mutateAsync({
      name: newNamespace,
    })
    setCurrentNamespace(res?.data || '')
    setIsDialogOpen(false)
  }

  const deleteNamespaceMutation = useMutation({
    mutationFn: namespaceApi.deleteNamespace,
    onSuccess: async () => {
      toast.success('工作目录删除成功')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onSettled: async () => {
      refetch()
    },
  })

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu modal={false}>
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
              工作目录
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
                  <DropdownMenuShortcut>
                    <X
                      className='size-4'
                      onClick={(e) => {
                        e.stopPropagation()
                        if (currentNamespace?.name === namespace?.name) {
                          toast.error('不能删除当前工作目录')
                          return
                        }
                        if (namespaces.length === 1) {
                          toast.error('至少需要一个工作目录')
                          return
                        }

                        setDeleteNamespace(namespace?.name)
                        setIsAlertOpen(true)
                      }}
                    />
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
                  添加工作目录
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加工作目录</DialogTitle>
              <DialogDescription>
                训练模型时，会将产生的文件保存在工作目录中
              </DialogDescription>
            </DialogHeader>
            <Input
              value={newNamespace}
              onChange={(e) => setNewNamespace(e.target.value)}
              placeholder='建议使用英文名称'
            />
            <DialogFooter>
              <Button
                onClick={() => setIsDialogOpen(false)}
                variant={'outline'}
              >
                取消
              </Button>
              <Button onClick={handleAddNamespace}>
                {createNamespaceMutation.isPending ? '创建中...' : '创建'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>删除工作目录</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              删除工作目录会删除目录中所有文件， 您确定要删除工作目录{' '}
              {deleteNamespace} 吗？
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <Button
                onClick={async (e) => {
                  e.stopPropagation()

                  if (!deleteNamespace) {
                    return
                  }
                  await deleteNamespaceMutation.mutateAsync(deleteNamespace)
                  setDeleteNamespace(null)
                  setIsAlertOpen(false)
                }}
              >
                {deleteNamespaceMutation.isPending ? '删除中...' : '删除'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
