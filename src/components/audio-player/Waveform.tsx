import { useRef, useEffect } from 'react'
import { useWaveSurfer } from './hooks/useWaveSurfer'

interface WaveformProps {
  audioUrl: string | null
  onPlayAudioReady: (controls: {
    play: () => void
    pause: () => void
    toggle: () => void
    isPlaying: boolean
  }) => void
}

export function Waveform({ audioUrl, onPlayAudioReady }: WaveformProps) {
  const waveformRef = useRef<HTMLDivElement>(null)
  const { loadAudio, playAudio, pauseAudio, togglePlay, isPlaying } =
    useWaveSurfer(waveformRef)

  useEffect(() => {
    if (audioUrl) {
      loadAudio(audioUrl)
    }
  }, [audioUrl, loadAudio])

  useEffect(() => {
    onPlayAudioReady({
      play: togglePlay,
      pause: pauseAudio,
      toggle: togglePlay,
      isPlaying: isPlaying,
    })
  }, [onPlayAudioReady, playAudio, pauseAudio, togglePlay, isPlaying])

  return <div ref={waveformRef} className='mb-4' />
}
