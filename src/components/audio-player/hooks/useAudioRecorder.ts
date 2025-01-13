import { useState, useRef, useCallback } from 'react'
import { useRecordingTimer } from '@/hooks/useRecordingTimer'

export interface AudioState {
  url: string | null
  duration: string
  name: string
}

export function useAudioRecorder(tab: string) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioState, setAudioState] = useState<Record<string, AudioState>>({
    record: {
      url: null,
      duration: '0s',
      name: 'recording.wav',
    },
    upload: {
      url: null,
      duration: '0s',
      name: 'recording.wav',
    },
  })

  const { startTimer, stopTimer, formattedDuration, duration } =
    useRecordingTimer()

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const startTimeRef = useRef<number>(0)

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      startTimeRef.current = Date.now()
      startTimer()

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav',
        })
        const url = URL.createObjectURL(audioBlob)
        const duration = ((Date.now() - startTimeRef.current) / 1000).toFixed(1)
        setAudioState((prev) => ({
          ...prev,
          [tab]: { url, duration: `${duration}s`, name: 'recording.wav' },
        }))
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      stopTimer()
      console.error('Error accessing microphone:', error)
      throw new Error(
        'Failed to start recording. Please check your microphone permissions.'
      )
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      stopTimer()
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording, stopTimer])

  return {
    isRecording,
    audioState,
    startRecording,
    stopRecording,
    setAudioState,
    formattedDuration,
    duration,
  }
}
