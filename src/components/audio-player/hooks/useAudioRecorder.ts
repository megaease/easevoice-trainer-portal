import { useState, useRef, useCallback } from 'react'
import { AudioState } from '../types/audio'

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioState, setAudioState] = useState<AudioState>({
    url: null,
    duration: '0s',
    name: 'recording.wav',
  })
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

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/wav',
        })
        const url = URL.createObjectURL(audioBlob)
        const duration = ((Date.now() - startTimeRef.current) / 1000).toFixed(1)
        setAudioState({ url, duration: `${duration}s`, name: 'recording.wav' })
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      throw new Error(
        'Failed to start recording. Please check your microphone permissions.'
      )
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  return {
    isRecording,
    audioState,
    startRecording,
    stopRecording,
    setAudioState,
  }
}
