import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FileItem } from './types'

interface DeleteDialogProps {
  selectedFiles: FileItem[]
  isOpen: boolean
  isLoading: boolean
  onClose: () => void
  onConfirm: () => void
}

export const DeleteDialog = ({
  selectedFiles,
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
            你确定要删除以下{selectedFiles.length}个文件吗？此操作不可恢复。
          </DialogDescription>
        </DialogHeader>

        <div className='max-h-[200px] overflow-y-auto'>
          <ul className='space-y-2'>
            {selectedFiles.map((file) => (
              <li key={file.id} className='text-sm text-gray-500'>
                {file.name}
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
