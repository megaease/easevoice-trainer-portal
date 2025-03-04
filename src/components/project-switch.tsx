import * as React from 'react'
import { useIsMutating, useMutation } from '@tanstack/react-query'
import namespaceApi from '@/apis/namespace'
import { ChevronsUpDown, Plus, X } from 'lucide-react'
import { toast } from 'sonner'
import { useNamespaceStore } from '@/stores/namespaceStore'
import { useUUIDStore } from '@/stores/uuidStore'
import { getRandomIconByName } from '@/lib/randomIcon'
import { cn, isTaskRunning } from '@/lib/utils'
import { Namespace, useNamespaceList } from '@/hooks/use-namespace-list'
import { useSession } from '@/hooks/use-session'
import { Button } from '@/components/ui/button'
import {
  Dialog,
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
} from '@/components/ui/sidebar'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'

export function ProjectSwitch() {
  // State and hooks
  const isMutating = useIsMutating()
  const session = useSession()
  const uuid = useUUIDStore((state) => state.current)
  const { currentNamespace, setCurrentNamespace } = useNamespaceStore()
  const { namespaces = [], refetch } = useNamespaceList()
  const [deleteNamespace, setDeleteNamespace] = React.useState<string | null>(
    null
  )
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const [newNamespace, setNewNamespace] = React.useState('')
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  // Get an icon for the current namespace
  const Icon = React.useMemo(
    () => getRandomIconByName(currentNamespace?.name || ''),
    [currentNamespace?.name]
  )

  // Check if switching projects is allowed
  const isTaskRunningValue = isTaskRunning(uuid, session.data)
  const isSystemBusy = isMutating > 0
  const canSwitchProject = React.useCallback(() => {
    if (isTaskRunningValue) {
      toast.error('当前有任务正在执行', {
        description: '请等待任务执行完毕后再切换项目',
      })
      return false
    }

    if (isSystemBusy) {
      toast.error('系统正在处理中', {
        description: '请等待操作完成后再切换项目',
      })
      return false
    }

    return true
  }, [isMutating, session.data, uuid])

  // Handle project switching
  const handleChangeNamespace = async (namespace: Namespace) => {
    await session.refetch()
    if (canSwitchProject()) {
      setCurrentNamespace(namespace)
    }
  }

  // Create namespace mutation
  const createNamespaceMutation = useMutation({
    mutationFn: namespaceApi.createNamespace,
    onSuccess: (res) => {
      toast.success('项目创建成功')
      setCurrentNamespace(res?.data || '')
      setIsDialogOpen(false)
      setNewNamespace('')
    },
    onError: (error) => {
      toast.error((error as any)?.response?.data?.detail || '创建项目失败', {
        description: '请检查项目名称是否合法或是否已存在',
      })
    },
    onSettled: () => {
      refetch()
    },
  })

  // Delete namespace mutation
  const deleteNamespaceMutation = useMutation({
    mutationFn: namespaceApi.deleteNamespace,
    onSuccess: async () => {
      toast.success('项目删除成功')
      setDeleteNamespace(null)
      setIsAlertOpen(false)
    },
    onError: (error) => {
      toast.error('删除项目失败', {
        description: (error as any)?.response?.data?.detail || error.message,
      })
    },
    onSettled: async () => {
      refetch()
    },
  })

  // Handle adding a new namespace
  const handleAddNamespace = async () => {
    if (!newNamespace.trim()) {
      toast.error('项目名称不能为空')
      return
    }

    await createNamespaceMutation.mutateAsync({
      name: newNamespace,
    })
  }

  // Handle namespace deletion check
  const handleDeleteCheck = (e: React.MouseEvent, namespace: Namespace) => {
    e.stopPropagation()

    if (currentNamespace?.name === namespace?.name) {
      toast.error('不能删除当前项目')
      return
    }

    if (namespaces.length <= 1) {
      toast.error('至少需要一个项目')
      return
    }

    setDeleteNamespace(namespace?.name)
    setIsAlertOpen(true)
  }

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
                  {currentNamespace?.name || '未选择项目'}
                </span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            align='start'
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>
              项目
            </DropdownMenuLabel>
            {namespaces.map((namespace) => {
              const Icon = getRandomIconByName(namespace?.name || '')
              return (
                <DropdownMenuItem
                  key={namespace?.name}
                  onClick={() => handleChangeNamespace(namespace)}
                  className='gap-2 p-2 truncate'
                  disabled={isTaskRunningValue || isSystemBusy}
                >
                  <div className='flex size-6 items-center justify-center rounded-sm border'>
                    <Icon className='size-4' />
                  </div>
                  {namespace?.name}
                  <DropdownMenuShortcut>
                    <X
                      className='size-4'
                      onClick={(e) => handleDeleteCheck(e, namespace)}
                    />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='gap-2 p-2'
              onClick={() => setIsDialogOpen(true)}
              disabled={isTaskRunningValue || isSystemBusy}
            >
              <div className='flex items-center justify-center w-full h-full gap-2'>
                <Plus className='size-4' />
                <div className='font-medium text-muted-foreground'>
                  创建项目
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Create project dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>创建项目</DialogTitle>
              <DialogDescription>
                克隆和训练模型产生的文件都会保存在项目中
              </DialogDescription>
            </DialogHeader>
            <Input
              value={newNamespace}
              onChange={(e) => setNewNamespace(e.target.value)}
              placeholder='建议使用英文名称'
              disabled={createNamespaceMutation.isPending}
            />
            <DialogFooter>
              <Button
                onClick={() => setIsDialogOpen(false)}
                variant={'outline'}
                disabled={createNamespaceMutation.isPending}
              >
                取消
              </Button>
              <Button
                onClick={handleAddNamespace}
                disabled={
                  createNamespaceMutation.isPending || !newNamespace.trim()
                }
              >
                {createNamespaceMutation.isPending ? '创建中...' : '创建'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete project confirmation */}
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>删除项目</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              删除项目会删除目录中所有文件， 您确定要删除项目 {deleteNamespace}{' '}
              吗？
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteNamespaceMutation.isPending}>
                取消
              </AlertDialogCancel>
              <Button
                onClick={async (e) => {
                  e.stopPropagation()
                  if (deleteNamespace) {
                    await deleteNamespaceMutation.mutateAsync(deleteNamespace)
                  }
                }}
                disabled={deleteNamespaceMutation.isPending || !deleteNamespace}
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
