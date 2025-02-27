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
      // 添加兼容性检查
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('您的浏览器不支持录音功能，请使用最新版本的 Chrome、Firefox 或 Safari')
      }

      // 检查是否支持音频录制
      const devices = await navigator.mediaDevices.enumerateDevices()
      const hasAudioInput = devices.some(device => device.kind === 'audioinput')
      if (!hasAudioInput) {
        throw new Error('未检测到麦克风设备')
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      })
      
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
      console.error('录音初始化失败:', error)
      throw new Error(error instanceof Error ? error.message : '录音初始化失败，请检查麦克风权限')
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
