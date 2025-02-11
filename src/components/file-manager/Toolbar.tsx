import React from 'react'
import { RequestBody } from '@/apis/files'
import {
  FolderPlus,
  FilePlus,
  Trash,
  Upload,
  Download,
  LayoutGrid,
  List,
  RefreshCw,
  Home,
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
  onDelete: () => void
  onUpload: (data: RequestBody) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  hasSelection: boolean
  isLoading: boolean
  onRefresh: () => void
  onHome: () => void
  currentPath: string
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onNewFolder,
  onDelete,
  onUpload,
  viewMode,
  onViewModeChange,
  hasSelection,
  isLoading,
  onRefresh,
  onHome,
  currentPath,
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    if (!event.target.files) return
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onloadend = async () => {
      const base64String =
        typeof reader.result === 'string' ? reader.result.split(',')[1] : ''
      const requestBody = {
        directoryPath: currentPath,
        fileName: file.name,
        fileContent: base64String,
      }
      onUpload(requestBody)
    }

    reader.readAsDataURL(file) // 将文件读取为 Data URL
  }

  return (
    <TooltipProvider>
      <div className='flex items-center justify-between p-4 bg-background border-b flex-wrap'>
        <div className='flex items-center space-x-1 space-y-1'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon' onClick={onRefresh}>
                <RefreshCw
                  className={cn('h-4 w-4', { 'animate-spin': isLoading })}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>刷新</TooltipContent>
          </Tooltip>
          <Separator orientation='vertical' className='h-6' />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon' onClick={onHome}>
                <Home className='h-5 w-5 text-black' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>工作目录</TooltipContent>
          </Tooltip>
          <Separator orientation='vertical' className='h-6' />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon' onClick={onNewFolder}>
                <FolderPlus className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>新建目录</TooltipContent>
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
          <Separator orientation='vertical' className='h-6' />
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
