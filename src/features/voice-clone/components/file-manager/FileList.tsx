import React from 'react'
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
    const commonContent = (
      <>
        <div className='flex items-center space-x-3'>
          {getFileIcon(file)}
          <span className='truncate'>{file.name}</span>
        </div>
        <div className='text-sm text-gray-500'>
          {file.size && `${(file.size / 1024).toFixed(2)} KB`}
        </div>
        <div className='text-xs text-gray-400'>
          {file.lastModified.toLocaleDateString()}
        </div>
      </>
    )

    return (
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
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (e.ctrlKey || e.metaKey) {
                onSelect(file.id)
              } else {
                onSelect(file.id)
              }
            }}
            onDoubleClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (file.type === 'folder') {
                onOpen(file)
                console.log('Open folder:', file)
              }
            }}
          >
            {viewMode === 'grid' ? (
              commonContent
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
    )
  }

  return (
    <div
      className={cn(
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
          : 'flex flex-col space-y-2',
        'p-4'
      )}
    >
      {files.map((file) => (
        <FileItem key={file.id} file={file} />
      ))}
    </div>
  )
}
