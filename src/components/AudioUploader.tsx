import React, { useState, useRef, useEffect } from 'react'
import {
  Play,
  Pause,
  Volume2,
  Mic,
  Upload,
  RotateCcw,
  FastForward,
  X,
  Scissors,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'

interface AudioFile {
  file: File
  url: string
  name: string
}

export default function AudioUploader() {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([])
  const [currentAudio, setCurrentAudio] = useState<AudioFile | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [audioData, setAudioData] = useState<number[]>([])

  const audioRef = useRef<HTMLAudioElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const recordingInterval = useRef<NodeJS.Timeout>()

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const drawWaveform = () => {
    if (!audioRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const audioContext = new AudioContext()
    const source = audioContext.createMediaElementSource(audioRef.current)
    const analyzer = audioContext.createAnalyser()

    source.connect(analyzer)
    analyzer.connect(audioContext.destination)

    analyzer.fftSize = 256
    const bufferLength = analyzer.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw)
      analyzer.getByteFrequencyData(dataArray)

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const barWidth = (canvas.width / bufferLength) * 2.5
      let barHeight
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height

        ctx.fillStyle = `rgb(246, 139, 51)`
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

        x += barWidth + 1
      }
    }

    draw()
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const audioChunks: BlobPart[] = []

      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        const audioUrl = URL.createObjectURL(audioBlob)
        const file = new File(
          [audioBlob],
          `Recording ${audioFiles.length + 1}.wav`,
          { type: 'audio/wav' }
        )
        setAudioFiles((prev) => [
          ...prev,
          { file, url: audioUrl, name: file.name },
        ])
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      recordingInterval.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop())
      setIsRecording(false)
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
      }))
      setAudioFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handlePlay = (audio: AudioFile) => {
    setCurrentAudio(audio)
    setIsPlaying(true)
    if (audioRef.current) {
      audioRef.current.play()
      drawWaveform()
    }
  }

  const handlePause = () => {
    setIsPlaying(false)
    audioRef.current?.pause()
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration)
    }
  }

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const handlePlaybackRateChange = () => {
    const rates = [1, 1.5, 2]
    const currentIndex = rates.indexOf(playbackRate)
    const nextRate = rates[(currentIndex + 1) % rates.length]
    setPlaybackRate(nextRate)
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate
    }
  }

  const removeAudio = (index: number) => {
    setAudioFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardContent className='p-6 space-y-6'>
        <div className='flex justify-between items-center'>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='icon'
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className='h-4 w-4' />
            </Button>
            <input
              id='file-upload'
              type='file'
              accept='audio/*'
              multiple
              className='hidden'
              onChange={handleFileChange}
            />
            <Button
              variant='outline'
              size='icon'
              onClick={isRecording ? stopRecording : startRecording}
              className={isRecording ? 'text-red-500' : ''}
            >
              <Mic className='h-4 w-4' />
            </Button>
          </div>
          {isRecording && (
            <span className='text-red-500 animate-pulse'>
              录音中 {Math.floor(recordingTime / 60)}:
              {(recordingTime % 60).toString().padStart(2, '0')}
            </span>
          )}
        </div>

        <div className='space-y-2'>
          {audioFiles.map((audio, index) => (
            <div
              key={index}
              className='flex items-center justify-between bg-muted/50 p-2 rounded-lg'
            >
              <span className='truncate flex-1 mr-4'>{audio.name}</span>
              <div className='flex items-center gap-2'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() =>
                    currentAudio?.url === audio.url
                      ? handlePause()
                      : handlePlay(audio)
                  }
                >
                  {currentAudio?.url === audio.url && isPlaying ? (
                    <Pause className='h-4 w-4' />
                  ) : (
                    <Play className='h-4 w-4' />
                  )}
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => removeAudio(index)}
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* {currentAudio && (
          <div className='space-y-4'>
            <audio
              ref={audioRef}
              src={currentAudio.url}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
            />

            <canvas
              ref={canvasRef}
              className='w-full h-24 bg-white rounded-lg'
              width={800}
              height={100}
            />

            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={
                    isPlaying ? handlePause : () => handlePlay(currentAudio)
                  }
                >
                  {isPlaying ? (
                    <Pause className='h-4 w-4' />
                  ) : (
                    <Play className='h-4 w-4' />
                  )}
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={handlePlaybackRateChange}
                >
                  {playbackRate}x
                </Button>
              </div>
              <span className='text-sm text-muted-foreground'>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <Slider
              value={[currentTime]}
              max={duration}
              step={0.1}
              onValueChange={handleSliderChange}
              className='my-2'
            />

            <div className='flex items-center gap-2'>
              <Volume2 className='h-4 w-4' />
              <Slider
                value={[volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className='w-24'
              />
            </div>
          </div>
        )} */}
      </CardContent>
    </Card>
  )
}

function formatTime(time: number): string {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
