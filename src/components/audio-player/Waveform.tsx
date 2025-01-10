import { useRef, useEffect } from 'react'
import { useWaveSurfer } from './hooks/useWaveSurfer'

interface WaveformProps {
  audioUrl: string | null
  onPlayAudioReady: (playFunction: () => void) => void
}

export function Waveform({ audioUrl, onPlayAudioReady }: WaveformProps) {
  const waveformRef = useRef<HTMLDivElement>(null)
  const { loadAudio, playAudio } = useWaveSurfer(waveformRef)
  console.log('WaveformProps:')
  useEffect(() => {
    if (audioUrl) {
      loadAudio(audioUrl)
    }
  }, [audioUrl, loadAudio])

  useEffect(() => {
    onPlayAudioReady(playAudio)
  }, [onPlayAudioReady, playAudio])

  return <div ref={waveformRef} className='mb-4' />
}
