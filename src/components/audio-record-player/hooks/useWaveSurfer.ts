import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import WaveSurfer, { WaveSurferOptions } from 'wavesurfer.js'

interface WaveSurferHook {
  isPlaying: boolean
  togglePlay: () => void
  loadAudio: (url: string) => void
  isReady: boolean
}

const defaultOptions: Partial<WaveSurferOptions> = {
  height: 80,
  waveColor: '#D1D5DB',
  progressColor: '#6366F1',
  cursorColor: 'transparent',
  barWidth: 2,
  barGap: 3,
  normalize: true,
}

export function useWaveSurfer(
  containerRef: React.RefObject<HTMLDivElement>,
  options?: Partial<WaveSurferOptions>
): WaveSurferHook {
  const wavesurfer = useRef<WaveSurfer | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const mergedOptions = useMemo(() => ({ ...defaultOptions, ...options }), [])
  useEffect(() => {
    if (!containerRef.current) return
    wavesurfer.current = WaveSurfer.create(
      Object.assign(
        {
          container: containerRef.current,
        },
        mergedOptions
      )
    )

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleFinish = () => setIsPlaying(false)

    wavesurfer.current.on('init', () => setIsReady(true))
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef])

  const togglePlay = useCallback(async () => {
    if (wavesurfer.current && isReady) {
      await wavesurfer.current.playPause()
    }
  }, [isReady])

  const loadAudio = useCallback(
    (url: string) => {
      if (wavesurfer.current && isReady) {
        if (url.startsWith('data:audio/wav;base64,')) {
          const base64Audio = url.split(',')[1]
          const audioBlob = new Blob(
            [Uint8Array.from(atob(base64Audio), (c) => c.charCodeAt(0))],
            { type: 'audio/wav' }
          )
          const audioUrl = URL.createObjectURL(audioBlob)

          wavesurfer.current.load(audioUrl)
        } else {
          wavesurfer.current.load(url)
        }
      }
    },
    [isReady]
  )

  return {
    isPlaying,
    togglePlay,
    loadAudio,
    isReady,
  }
}
