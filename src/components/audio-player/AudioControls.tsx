import { Play, Share2, Download, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface AudioState {
  url: string | null
  duration: string
  name: string
}
interface AudioControlsProps {
  audioState: AudioState
  onPlay: () => void
  onDelete: () => void
}

export function AudioControls({
  audioState,
  onPlay,
  onDelete,
}: AudioControlsProps) {
  return (
    <div className='flex items-center justify-between mb-4'>
      <div className='flex items-center'>
        <Button
          type='button'
          size='icon'
          variant='ghost'
          onClick={onPlay}
          className='text-indigo-600'
          aria-label='播放音频'
        >
          <Play className='h-6 w-6' />
        </Button>
        <span className='ml-2 text-gray-500'>
          {audioState.name} • {audioState.duration}
        </span>
      </div>
      <div className='flex items-center gap-2'>
        <Button type='button' size='icon' variant='ghost' aria-label='下载音频'>
          <Download className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          size='icon'
          variant='ghost'
          onClick={onDelete}
          aria-label='删除音频'
        >
          <X className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
