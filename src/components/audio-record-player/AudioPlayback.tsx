import { useRef, useEffect } from 'react'
import { Pause, Play, Download, X } from 'lucide-react'
import { Button } from '../ui/button'
import { useWaveSurfer } from './hooks/useWaveSurfer'

interface AudioPlaybackProps {
  audioUrl: string | null
  handleDeleteAudio: () => void
}

export default function AudioPlayback({
  audioUrl,
  handleDeleteAudio,
}: AudioPlaybackProps): JSX.Element {
  const waveformRef = useRef<HTMLDivElement | null>(null)
  const { isPlaying, togglePlay, loadAudio } = useWaveSurfer(waveformRef)

  useEffect(() => {
    if (audioUrl) {
      loadAudio(audioUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl])

  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center'>
          <Button
            type='button'
            onClick={togglePlay}
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
            {/* {audioState.name} • {audioState.duration} */}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            type='button'
            size='icon'
            variant='ghost'
            aria-label='下载音频'
          >
            <Download className='h-4 w-4' />
          </Button>
          <Button
            type='button'
            size='icon'
            variant='ghost'
            onClick={handleDeleteAudio}
            aria-label='删除音频'
          >
            <X className='h-6 w-6' color='red' />
          </Button>
        </div>
      </div>
      <div ref={waveformRef} className='bg-gray-50 rounded-lg p-4 mb-4' />
    </div>
  )
}
