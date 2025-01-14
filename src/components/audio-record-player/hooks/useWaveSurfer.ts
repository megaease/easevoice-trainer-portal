import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import WaveSurfer, { WaveSurferOptions } from 'wavesurfer.js'

interface WaveSurferHook {
  isPlaying: boolean
  togglePlay: () => void
  loadAudio: (url: string) => void
}

export function useWaveSurfer(
  containerRef: React.RefObject<HTMLDivElement>,
  options?: Partial<WaveSurferOptions>
): WaveSurferHook {
  console.log('render')
  const wavesurfer = useRef<WaveSurfer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    wavesurfer.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#D1D5DB',
      progressColor: '#6366F1',
      cursorColor: 'transparent',
      barWidth: 2,
      barGap: 3,
      height: 80,
      normalize: true,
      ...options,
    })

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleFinish = () => setIsPlaying(false)

    wavesurfer.current.on('play', handlePlay)
    wavesurfer.current.on('pause', handlePause)
    wavesurfer.current.on('finish', handleFinish)

    return () => {
      if (wavesurfer.current) {
        try {
          wavesurfer.current.unAll()
          wavesurfer.current.destroy()
        } catch (error) {
          console.error('Error destroying WaveSurfer:', error)
        }
      }
    }
  }, [])

  const togglePlay = useCallback(() => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause()
    }
  }, [])

  const loadAudio = useCallback((url: string) => {
    if (wavesurfer.current) {
      wavesurfer.current.load(url)
    }
  }, [])

  return useMemo(
    () => ({
      isPlaying,
      togglePlay,
      loadAudio,
    }),
    [isPlaying, togglePlay, loadAudio]
  )
}
