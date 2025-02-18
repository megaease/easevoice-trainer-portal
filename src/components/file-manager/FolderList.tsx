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
import { FolderItem, ViewMode } from './types'

interface FolderListProps {
  folders: FolderItem[]
  selectedItems: string[]
  viewMode: ViewMode
  onSelect: (name: string) => void
  onOpen: (item: FolderItem) => void
  onDelete: (item: FolderItem) => void
  isLoading: boolean
  handleCopyPath: (name: string) => void
}

export const FolderList: React.FC<FolderListProps> = ({
  folders,
  selectedItems,
  viewMode,
  onSelect,
  onOpen,
  onDelete,
  handleCopyPath,
}) => {
  const getFileIcon = () => {
    return <FolderIcon className='h-6 w-6 text-yellow-500' />
  }

  const FolderItem = ({ folder }: { folder: folderItem }) => {
    const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleClick = (e: React.MouseEvent, folder: folderItem) => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current)
        clickTimerRef.current = null
        onOpen(folder)
      } else {
        clickTimerRef.current = setTimeout(() => {
          if (e.ctrlKey || e.metaKey) {
            onSelect(folder.directoryName)
          } else {
            onSelect(folder.directoryName)
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
                  folder.directoryName
                ),
                'border-gray-200': !selectedItems.includes(
                  folder.directoryName
                ),
                'p-4': viewMode === 'grid',
                'p-2': viewMode !== 'grid',
              },
              'dark:bg-gray-800 dark:border-gray-700',
              'dark:hover:bg-gray-700 dark:hover:border-gray-200',
              {
                'dark:border-gray-200': selectedItems.includes(
                  folder.directoryName
                ),
              },
              'transition-colors duration-200 ease-in-out'
            )}
            onClick={(e) => handleClick(e, folder)}
          >
            {viewMode === 'grid' ? (
              <div className='flex flex-col items-center space-y-2 select-none w-[120px] justify-center'>
                {getFileIcon()}
                <span
                  className='truncate text-center w-full'
                  title={folder.directoryName}
                >
                  {folder.directoryName}
                </span>
              </div>
            ) : (
              <div className='flex items-center justify-between select-none'>
                <div className='flex items-center space-x-3 flex-1 truncate'>
                  {getFileIcon()}
                  <span className='truncate' title={folder.directoryName}>
                    {folder.directoryName}
                  </span>
                </div>
              </div>
            )}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => onOpen(folder)}>
            <Eye className='mr-2 h-4 w-4' />
            打开
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handleCopyPath(folder.directoryName)}>
            <Copy className='mr-2 h-4 w-4' />
            复制路径
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => onDelete(folder)}
            className='text-red-600 focus:text-red-600'
          >
            <Trash className='mr-2 h-4 w-4' />
            删除
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
  }

  return (
    <>
      {folders.map((folder) => (
        <FolderItem key={folder.directoryName} folder={folder} />
      ))}
    </>
  )
}
