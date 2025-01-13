import { useRef, useEffect, useCallback, useState } from 'react'
import { set } from 'zod'
import WaveSurfer from 'wavesurfer.js'

export function useWaveSurfer(containerRef: React.RefObject<HTMLDivElement>) {
  const wavesurferRef = useRef<WaveSurfer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const createWaveSurfer = useCallback(() => {
    if (containerRef.current && !wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: containerRef.current,
        waveColor: '#D1D5DB',
        progressColor: '#6366F1',
        cursorColor: 'transparent',
        barWidth: 2,
        barGap: 3,
        height: 80,
        normalize: true,
      })
    }
  }, [])

  useEffect(() => {
    createWaveSurfer()
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy()
        wavesurferRef.current = null
      }
    }
  }, [createWaveSurfer])

  const loadAudio = useCallback((audioUrl: string) => {
    if (wavesurferRef.current) {
      wavesurferRef.current.load(audioUrl)
    }
  }, [])

  const playAudio = useCallback(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.play()
      setIsPlaying(true)
    }
  }, [])

  const pauseAudio = useCallback(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.pause()
      setIsPlaying(false)
    }
  }, [])
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseAudio()
    } else {
      playAudio()
    }
  }, [isPlaying, playAudio, pauseAudio])

  return { loadAudio, playAudio, pauseAudio, togglePlay, isPlaying }
}
