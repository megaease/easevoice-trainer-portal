import { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import namespaceApi from '@/apis/namespace'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useNamespaceStore } from '@/stores/namespaceStore'
import { useNamespaceList } from '@/hooks/use-namespace-list'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ProjectSwitch } from '@/components/project-switch'
import ProjectSelectForm from './project-select-form'

export function ProjectSelect() {
  const navigate = useNavigate()
  const { currentNamespace } = useNamespaceStore()
  const [rootPath, setRootPath] = useState('')
  const [isRootDialogOpen, setIsRootDialogOpen] = useState(false)

  const rootQuery = useQuery({
    queryKey: ['namespaceRoot'],
    queryFn: async () => {
      const res = await namespaceApi.getNamespaceRoot()
      return res.data
    },
  })

  const updateRootMutation = useMutation({
    mutationFn: async (path: string) => {
      return await namespaceApi.updateNamespaceRoot({ 'namespaces-root': path })
    },
    onSuccess: () => {
      toast.success('项目根目录已更新')
      setIsRootDialogOpen(false)
      rootQuery.refetch()
    },
    onError: (error) => {
      toast.error(
        `更新失败: ${error instanceof Error ? error.message : '未知错误'}`
      )
    },
  })

  const { isLoading: isNamespacesLoading } = useNamespaceList()

  useEffect(() => {
    if (rootQuery.data && !rootQuery.data.setOnce) {
      setRootPath(rootQuery.data['namespaces-root'])
      setIsRootDialogOpen(true)
    }
  }, [rootQuery.data])

  const handleRootPathSubmit = () => {
    if (!rootPath.trim()) {
      toast.error('请输入有效的路径')
      return
    }
    updateRootMutation.mutate(rootPath)
  }

  if (rootQuery.isLoading) {
    return (
      <div className='h-screen w-screen flex items-center justify-center p-4 bg-background'>
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='h-12 w-12 animate-spin text-primary' />
          <p className='text-muted-foreground'>正在加载系统配置...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='h-screen w-screen flex items-center justify-center p-4 bg-background'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>选择项目</CardTitle>
          <CardDescription>请选择一个项目以继续</CardDescription>
        </CardHeader>
        <CardContent>
          {isNamespacesLoading ? (
            <div className='flex justify-center py-8'>
              <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
            </div>
          ) : (
            <ProjectSelectForm />
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isRootDialogOpen}
        onOpenChange={(open) => {
          // 只有在已经设置过根目录的情况下才允许关闭
          if (!rootQuery.data?.setOnce) {
            return
          }
          setIsRootDialogOpen(open)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>设置项目根目录</DialogTitle>
            <DialogDescription>
              请确认或修改系统将用于存储项目数据的根目录路径
            </DialogDescription>
          </DialogHeader>
          <div className='py-4'>
            <Label htmlFor='rootPath'>根目录路径</Label>
            <Input
              id='rootPath'
              value={rootPath}
              onChange={(e) => setRootPath(e.target.value)}
              placeholder='请输入项目根目录路径'
              className='mt-2'
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleRootPathSubmit}
              disabled={updateRootMutation.isPending}
            >
              {updateRootMutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  保存中...
                </>
              ) : (
                '确认并保存'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
