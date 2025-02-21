import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface DeleteDialogProps {
  deletePaths: string[]
  isOpen: boolean
  isLoading: boolean
  onClose: () => void
  onConfirm: () => void
}

export const DeleteDialog = ({
  deletePaths,
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}: DeleteDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>
            你确定要删除以下{deletePaths.length}
            个文件或者文件夹吗？此操作不可恢复。
          </DialogDescription>
        </DialogHeader>

        <div className='overflow-y-auto w-full'>
          <ul className='space-y-2 '>
            {deletePaths.map((file) => (
              <li key={file} className='text-sm text-gray-500 break-words'>
                {file}
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={isLoading}>
            取消
          </Button>
          <Button
            variant='destructive'
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? '删除中...' : '删除'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
