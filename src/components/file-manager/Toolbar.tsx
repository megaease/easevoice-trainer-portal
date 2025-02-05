import React from 'react'
import {
  FolderPlus,
  FilePlus,
  Trash,
  Upload,
  Download,
  LayoutGrid,
  List,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Input } from '../ui/input'
import { ViewMode } from './types'

interface ToolbarProps {
  onNewFolder: () => void
  onNewFile: () => void
  onDelete: () => void
  onUpload: (files: File[]) => void
  onDownload: () => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  hasSelection: boolean
  isLoading: boolean
  onRefresh: () => void
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
  isLoading,
  onRefresh,
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
    <TooltipProvider>
      <div className='flex items-center justify-between p-4 bg-background border-b flex-wrap'>
        <div className='flex items-center space-x-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon' onClick={onRefresh}>
                <RefreshCw
                  className={cn('h-4 w-4', { 'animate-spin': isLoading })}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh</TooltipContent>
          </Tooltip>
          <Separator orientation='vertical' className='h-6' />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon' onClick={onNewFolder}>
                <FolderPlus className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>New Folder</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon' onClick={onNewFile}>
                <FilePlus className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>New File</TooltipContent>
          </Tooltip>
          <Separator orientation='vertical' className='h-6' />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon' asChild>
                <label>
                  <Upload className='h-4 w-4' />
                  <Input
                    type='file'
                    className='hidden'
                    multiple
                    onChange={handleFileUpload}
                  />
                </label>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Upload</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                onClick={onDownload}
                disabled={!hasSelection}
              >
                <Download className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                onClick={onDelete}
                disabled={!hasSelection}
              >
                <Trash className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </div>

        <div className='flex items-center space-x-2'>
          <ToggleGroup
            type='single'
            value={viewMode}
            onValueChange={(value: ViewMode) => onViewModeChange(value)}
          >
            <ToggleGroupItem value='grid' aria-label='Grid View'>
              <LayoutGrid className='h-4 w-4' />
            </ToggleGroupItem>
            <ToggleGroupItem value='list' aria-label='List View'>
              <List className='h-4 w-4' />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </TooltipProvider>
  )
}
