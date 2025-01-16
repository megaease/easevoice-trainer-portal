import React, { useEffect, useRef } from 'react'
import {
  FolderIcon,
  DocumentIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/outline'
import { Eye, Copy, Trash } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu'
import { Spinner } from '../ui/Spinner'
import { Skeleton } from '../ui/skeleton'
import { FilePreview } from './FilePreview'
import { FileItem, ViewMode } from './types'

interface FileListProps {
  files: FileItem[]
  selectedItems: string[]
  viewMode: ViewMode
  onSelect: (id: string) => void
  onOpen: (item: FileItem) => void
  onDelete: (ids: string[]) => void
  isLoading: boolean
}

export const FileList: React.FC<FileListProps> = ({
  files,
  selectedItems,
  viewMode,
  onSelect,
  onOpen,
  onDelete,
  isLoading,
}) => {
  const [previewFile, setPreviewFile] = React.useState<FileItem | null>(null)

  const handleCopyPath = async (file: FileItem) => {
    try {
      await navigator.clipboard.writeText(file.path)
    } catch (err) {
      console.error('Failed to copy path:', err)
    }
  }

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder')
      return <FolderIcon className='h-6 w-6 text-yellow-500' />
    if (file.mimeType?.startsWith('audio/'))
      return <MusicalNoteIcon className='h-6 w-6 text-purple-500' />
    return <DocumentIcon className='h-6 w-6 text-blue-500' />
  }

  const FileItem = ({ file }: { file: FileItem }) => {
    const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleClick = (e: React.MouseEvent, file: FileItem) => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current)
        clickTimerRef.current = null
        onOpen(file)
      } else {
        clickTimerRef.current = setTimeout(() => {
          if (e.ctrlKey || e.metaKey) {
            onSelect(file.id)
          } else {
            onSelect(file.id)
          }
          clickTimerRef.current = null
        }, 200)
      }
    }

    // 组件卸载时清理
    useEffect(() => {
      return () => {
        if (clickTimerRef.current) {
          clearTimeout(clickTimerRef.current)
        }
      }
    }, [])

    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn(
              'cursor-pointer  border rounded-lg hover:bg-gray-50',
              {
                'bg-blue-50 border-blue-500': selectedItems.includes(file.id),
                'border-gray-200': !selectedItems.includes(file.id),
                'p-4': viewMode === 'grid',
                'p-2': viewMode !== 'grid',
              },
              'dark:bg-gray-800 dark:border-gray-700',
              'dark:hover:bg-gray-700 dark:hover:border-gray-200',
              {
                'dark:border-gray-200': selectedItems.includes(file.id),
              },
              'transition-colors duration-200 ease-in-out'
            )}
            onClick={(e) => handleClick(e, file)}
          >
            {viewMode === 'grid' ? (
              <div className='flex flex-col items-center space-y-2 select-none min-w-[120px] justify-center'>
                {getFileIcon(file)}
                <span className='truncate text-center w-full'>{file.name}</span>
              </div>
            ) : (
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3 flex-1'>
                  {getFileIcon(file)}
                  <span className='truncate'>{file.name}</span>
                </div>
                <div className='flex items-center space-x-4 text-sm text-gray-500'>
                  <span>
                    {file.size && `${(file.size / 1024).toFixed(2)} KB`}
                  </span>
                  <span>{file.lastModified.toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onClick={() =>
              file.type === 'folder' ? onOpen(file) : setPreviewFile(file)
            }
          >
            <Eye className='mr-2 h-4 w-4' />
            {file.type === 'folder' ? 'Open' : 'Preview'}
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleCopyPath(file)}>
            <Copy className='mr-2 h-4 w-4' />
            Copy Path
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => onDelete([file.id])}
            className='text-red-600 focus:text-red-600'
          >
            <Trash className='mr-2 h-4 w-4' />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
  }
  console.log('isLoading', isLoading)
  if (isLoading) {
    return (
      <div
        className={cn(
          'transition-all duration-300 ease-in-out p-4 h-full',
          viewMode === 'grid'
            ? 'flex flex-wrap flex-row gap-4'
            : 'flex flex-col space-y-2'
        )}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              'rounded-lg bg-slate-100',
              viewMode === 'grid' ? 'w-[150px] h-20' : 'w-full h-10'
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <div
        className={cn(
          'transition-all duration-300 ease-in-out p-4 h-full',
          viewMode === 'grid'
            ? 'flex flex-wrap flex-row gap-4'
            : 'flex flex-col space-y-2'
        )}
      >
        {files.map((file) => (
          <FileItem key={file.id} file={file} />
        ))}
      </div>
      <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
    </>
  )
}
