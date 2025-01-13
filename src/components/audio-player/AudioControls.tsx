import { Play, Download, X, Pause } from 'lucide-react'
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
  isPlaying: boolean
}

export function AudioControls({
  audioState,
  onPlay,
  onDelete,
  isPlaying,
}: AudioControlsProps) {
  return (
    <div className='flex items-center justify-between mb-4'>
      <div className='flex items-center'>
        <Button
          type='button'
          onClick={onPlay}
          aria-label='播放音频'
          className='flex items-center justify-center 
           rounded-full
           bg-blue-600 text-white
           hover:bg-blue-700 transition duration-300 shadow-lg'
          size={'lg'}
        >
          {isPlaying ? <Pause /> : <Play />}
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
