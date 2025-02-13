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
  onSelect: (name: string) => void
  onOpen: (item: FileItem) => void
  onDelete: (item: FileItem) => void
  isLoading: boolean
  handleCopyPath: (name: string) => void
}

export const FileList: React.FC<FileListProps> = ({
  files,
  selectedItems,
  viewMode,
  onSelect,
  onOpen,
  onDelete,
  handleCopyPath,
}) => {
  const getFileIcon = (file: FileItem) => {
    if (file.fileName.match(/\.(wav|mp3|ogg|flac|aac|m4a)$/i)) {
      return <MusicalNoteIcon className='h-6 w-6 text-purple-500' />
    }
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
            onSelect(file.fileName)
          } else {
            onSelect(file.fileName)
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
                'bg-blue-50 border-blue-500': selectedItems.includes(
                  file.fileName
                ),
                'border-gray-200': !selectedItems.includes(file.fileName),
                'p-4': viewMode === 'grid',
                'p-2': viewMode !== 'grid',
              },
              'dark:bg-gray-800 dark:border-gray-700',
              'dark:hover:bg-gray-700 dark:hover:border-gray-200',
              {
                'dark:border-gray-200': selectedItems.includes(file.fileName),
              },
              'transition-colors duration-200 ease-in-out'
            )}
            onClick={(e) => handleClick(e, file)}
          >
            {viewMode === 'grid' ? (
              <div className='flex flex-col items-center space-y-2 select-none w-[120px] justify-center'>
                {getFileIcon(file)}
                <span
                  className='truncate text-center w-full'
                  title={file.fileName}
                >
                  {file.fileName}
                </span>
              </div>
            ) : (
              <div className='flex items-center justify-between select-none gap-2 overflow-auto w-full'>
                <div className='flex items-center space-x-3 flex-1 truncate'>
                  {getFileIcon(file)}
                  <span
                    className='truncate text-sm flex-1'
                    title={file.fileName}
                  >
                    {file.fileName}
                  </span>
                </div>
                <div className='flex items-center space-x-4 text-sm text-gray-500'>
                  <span>
                    {file.fileSize && `${(file.fileSize / 1024).toFixed(2)} KB`}
                  </span>
                  <span>
                    {file.modifiedAt &&
                      new Date(file.modifiedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => onOpen(file)}>
            <Eye className='mr-2 h-4 w-4' />
            Preview
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleCopyPath(file.fileName)}>
            <Copy className='mr-2 h-4 w-4' />
            Copy Path
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => onDelete(file)}
            className='text-red-600 focus:text-red-600'
          >
            <Trash className='mr-2 h-4 w-4' />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
  }

  return (
    <>
      {files.map((file) => (
        <FileItem key={file.fileName} file={file} />
      ))}
    </>
  )
}
