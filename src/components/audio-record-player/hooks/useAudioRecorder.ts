import { useCallback, useEffect, useRef, useState } from 'react'

interface AudioRecorderState {
  isRecording: boolean
  duration: number
}

interface AudioRecorderHook extends AudioRecorderState {
  startRecording: () => Promise<void>
  stopRecording: () => Promise<Blob>
}

export function useAudioRecorder(): AudioRecorderHook {
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const chunks = useRef<BlobPart[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [duration, setDuration] = useState<number>(0)
  const clearRecordingTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])
  useEffect(() => {
    return () => {
      clearRecordingTimer()
      if (mediaRecorder.current?.stream) {
        mediaRecorder.current.stream
          .getTracks()
          .forEach((track) => track.stop())
      }
    }
  }, [clearRecordingTimer])
  const startRecording = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      chunks.current = []

      mediaRecorder.current.ondataavailable = (e: BlobEvent): void => {
        if (e.data.size > 0) {
          chunks.current.push(e.data)
        }
      }

      mediaRecorder.current.start()
      setIsRecording(true)
      setDuration(0)

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 100)
      }, 100)
    } catch (error) {
      console.error('Error starting recording:', error)
      throw error
    }
  }

  const stopRecording = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorder.current || !isRecording) {
        reject(new Error('No recording in progress'))
        return
      }

      mediaRecorder.current.onstop = (): void => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' })
        resolve(blob)
        setIsRecording(false)

        if (timerRef.current) {
          clearInterval(timerRef.current)
        }

        if (mediaRecorder.current?.stream) {
          mediaRecorder.current.stream
            .getTracks()
            .forEach((track) => track.stop())
        }
      }

      mediaRecorder.current.stop()
    })
  }

  return {
    isRecording,
    duration,
    startRecording,
    stopRecording,
  }
}
