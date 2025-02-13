import { useRef, useEffect } from 'react'
import { Pause, Play } from 'lucide-react'
import { useWaveSurfer } from '../audio-record-player/hooks/useWaveSurfer'
import { AudioState } from '../audio-record-player/type'
import { Button } from '../ui/button'

interface AudioPlayerProps {
  audioState: AudioState
  streamUrl?: string
}

export default function AudioPlayer({
  audioState,
  streamUrl,
}: AudioPlayerProps) {
  const waveformRef = useRef<HTMLDivElement | null>(null)
  const { isPlaying, togglePlay, loadAudio, isReady } = useWaveSurfer(
    waveformRef,
    {
      height: 50,
    }
  )
  const { url: audioUrl } = audioState
  useEffect(() => {
    if ((audioUrl || streamUrl) && isReady) {
      loadAudio((streamUrl || audioUrl) as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioUrl, streamUrl, isReady])

  return (
    <div className='flex items-center justify-center w-full'>
      <Button
        type='button'
        onClick={togglePlay}
        aria-label='播放音频'
        className='
        w-10 h-10
        rounded-full
        flex items-center justify-center
        bg-gradient-to-r from-purple-500 to-pink-500 
      text-white shadow-lg hover:shadow-xl transition-shadow duration-300'
      >
        {isPlaying ? <Pause /> : <Play />}
      </Button>

      <div className='flex-1'>
        <div ref={waveformRef} className='rounded-lg p-4' />
      </div>
      <span className='ml-2 text-gray-500 text-sm'>{audioState.duration}</span>
    </div>
  )
}
