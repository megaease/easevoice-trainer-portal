import { useRef, useEffect } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { Button } from '../ui/button'
import { useWaveSurfer } from './hooks/useWaveSurfer'
import { AudioState } from './type'

interface AudioPlaybackProps {
  audioState: AudioState
  handleDeleteAudio: () => void
}

export default function AudioPlayback({
  audioState,
  handleDeleteAudio,
}: AudioPlaybackProps) {
  const waveformRef = useRef<HTMLDivElement | null>(null)
  const { isPlaying, togglePlay, loadAudio, isReady } =
    useWaveSurfer(waveformRef)
  const { url: audioUrl } = audioState
  useEffect(() => {
    if (audioUrl && isReady) {
      loadAudio(audioUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl, isReady])

  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center'>
          <Button
            type='button'
            onClick={togglePlay}
            aria-label='播放音频'
            className='rounded-full
           flex items-center justify-center 
           bg-gradient-to-r from-purple-500 to-pink-500 
           text-white shadow-lg hover:shadow-xl transition-shadow duration-300'
            size={'lg'}
          >
            {isPlaying ? <Pause size={64} /> : <Play size={64} />}
          </Button>
          <span className='ml-2 text-gray-500'>
            {audioState.name} • {audioState.duration}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            size={'sm'}
            type='button'
            variant='outline'
            onClick={handleDeleteAudio}
            aria-label='删除音频'
            className='flex items-center transition-all bg-red-100
              text-red-600 hover:bg-red-200 hover:text-red-700 ring-2
              ring-red-500 shadow-lg shadow-red-500/30 
              dark:bg-red-700 dark:text-red-200 dark:hover:bg-red-600
              dark:hover:text-red-100 dark:ring-red-600 dark:shadow-red-600/30'
          >
            <RotateCcw absoluteStrokeWidth />
            重新开始
          </Button>
        </div>
      </div>
      <div ref={waveformRef} className='rounded-lg p-4 mb-4' />
    </div>
  )
}
