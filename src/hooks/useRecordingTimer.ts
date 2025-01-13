import { useState, useRef, useCallback, useEffect } from 'react'

export const useRecordingTimer = () => {
  const [duration, setDuration] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(() => {
    setDuration(0)
    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 100)
    }, 100)
  }, [])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      stopTimer()
    }
  }, [stopTimer])

  const formatDuration = useCallback((ms: number) => {
    return `${(ms / 1000).toFixed(1)}s`
  }, [])

  return {
    duration,
    formattedDuration: formatDuration(duration),
    startTimer,
    stopTimer,
    formatDuration,
  }
}
