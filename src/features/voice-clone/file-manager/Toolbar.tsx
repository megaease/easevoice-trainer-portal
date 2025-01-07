import React from 'react'
import {
  FolderPlusIcon,
  DocumentPlusIcon,
  TrashIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  ViewColumnsIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline'
import { ViewMode } from './types'

interface ToolbarProps {
  onNewFolder: () => void
  onNewFile: () => void
  onDelete: () => void
  onUpload: () => void
  onDownload: () => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  hasSelection: boolean
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onNewFolder,
  onNewFile,
  onDelete,
  onUpload,
  onDownload,
  viewMode,
  onViewModeChange,
  hasSelection,
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      onUpload(Array.from(files))
    }
    // Reset input value to allow uploading the same file again
    event.target.value = ''
  }

  return (
    <div className='flex items-center justify-between p-4 bg-white border-b'>
      <div className='flex items-center space-x-2'>
        <button
          onClick={onNewFolder}
          className='p-2 hover:bg-gray-100 rounded-lg'
          title='New Folder'
        >
          <FolderPlusIcon className='h-5 w-5' />
        </button>
        <button
          onClick={onNewFile}
          className='p-2 hover:bg-gray-100 rounded-lg'
          title='New File'
        >
          <DocumentPlusIcon className='h-5 w-5' />
        </button>
        <div className='w-px h-6 bg-gray-300 mx-2' />
        <label
          className='p-2 hover:bg-gray-100 rounded-lg cursor-pointer'
          title='Upload'
        >
          <ArrowUpTrayIcon className='h-5 w-5' />
          <input
            type='file'
            className='hidden'
            multiple
            onChange={handleFileUpload}
          />
        </label>
        <button
          onClick={onDownload}
          className='p-2 hover:bg-gray-100 rounded-lg'
          disabled={!hasSelection}
          title='Download'
        >
          <ArrowDownTrayIcon className='h-5 w-5' />
        </button>
        <button
          onClick={onDelete}
          className='p-2 hover:bg-gray-100 rounded-lg text-red-500'
          disabled={!hasSelection}
          title='Delete'
        >
          <TrashIcon className='h-5 w-5' />
        </button>
      </div>
      <div className='flex items-center space-x-2'>
        <button
          onClick={() => onViewModeChange('grid')}
          className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
          title='Grid View'
        >
          <ViewColumnsIcon className='h-5 w-5' />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
          title='List View'
        >
          <ListBulletIcon className='h-5 w-5' />
        </button>
      </div>
    </div>
  )
}
