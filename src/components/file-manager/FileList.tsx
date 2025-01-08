import React, { useRef } from 'react'
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
import { FileItem, ViewMode } from './types'

interface FileListProps {
  files: FileItem[]
  selectedItems: string[]
  viewMode: ViewMode
  onSelect: (id: string) => void
  onOpen: (item: FileItem) => void
  onDelete: (ids: string[]) => void
}

export const FileList: React.FC<FileListProps> = ({
  files,
  selectedItems,
  viewMode,
  onSelect,
  onOpen,
  onDelete,
}) => {
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
    return (
      <div
        onDoubleClick={() => {
          console.log('onDoubleClick')
          onOpen(file)
        }}
        // onClick={() => {
        //   onSelect(file.id)
        // }}
      >
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={cn(
                'cursor-pointer hover:bg-gray-50 border rounded-lg',
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
            >
              {viewMode === 'grid' ? (
                <div className='flex flex-col items-center space-y-2 select-none min-w-[120px] justify-center'>
                  {getFileIcon(file)}
                  <span className='truncate text-center w-full'>
                    {file.name}
                  </span>
                </div>
              ) : (
                <div className='flex items-center justify-between select-none'>
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
            <ContextMenuItem onClick={() => onOpen(file)}>
              <Eye className='mr-2 h-4 w-4' />
              Open
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
      </div>
    )
  }

  return (
    <div
      className={cn(
        viewMode === 'grid'
          ? 'flex flex-wrap flex-row gap-4'
          : 'flex flex-col space-y-2',
        'p-4 h-full'
      )}
    >
      {files.map((file) => (
        <FileItem key={file.id} file={file} />
      ))}
    </div>
  )
}
