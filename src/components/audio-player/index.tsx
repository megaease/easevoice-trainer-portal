import React, { useState, useCallback, useEffect } from 'react'
import { Mic, Play, Square, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import PulsatingButton from '../ui/pulsating-button'
import { AudioControls } from './AudioControls'
import { DurationTips } from './DurationTips'
import { RecorderTips } from './RecorderTips'
import { UploadTips } from './UploadTips'
import { Waveform } from './Waveform'
import { useAudioRecorder } from './hooks/useAudioRecorder'
import { AudioState } from './type'

type props = {
  onAudioStateChange: (audioState: AudioState) => void
}
function AudioPlayer({ onAudioStateChange }: props) {
  const [activeTab, setActiveTab] = useState('record')

  const {
    isRecording,
    audioState,
    startRecording,
    stopRecording,
    setAudioState,
    formattedDuration,
    duration,
  } = useAudioRecorder(activeTab)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioControls, setAudioControls] = useState({
    play: () => {},
    pause: () => {},
    toggle: () => {},
  })

  useEffect(() => {
    onAudioStateChange(audioState[activeTab])
  }, [audioState, onAudioStateChange, activeTab])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      const duration = `${(file.size / 32000).toFixed(1)}s`
      setAudioState((prev) => ({
        ...prev,
        upload: { url, duration, name: file.name },
      }))
    }
  }

  const handleDeleteAudio = () => {
    setAudioState((prev) => ({
      ...prev,
      [activeTab]: { url: null, duration: '0s', name: 'recording.wav' },
    }))
  }

  const handlePlayAudioReady = useCallback(
    ({
      play,
      pause,
      toggle,
      isPlaying: playing,
    }: {
      play: () => void
      pause: () => void
      toggle: () => void
      isPlaying: boolean
    }) => {
      setAudioControls({ play, pause, toggle })
      setIsPlaying(playing)
    },
    []
  )

  const playAudio = () => {
    audioControls.toggle()
    setIsPlaying((prev) => !prev)
  }
  const recorderAudioState = audioState['record']
  const uploadAudioState = audioState['upload']
  return (
    <div className='max-w-3xl mx-auto'>
      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='w-full'>
          <TabsTrigger value='record' className='w-full'>
            录制音频
          </TabsTrigger>
          <TabsTrigger value='upload' className='w-full'>
            上传音频
          </TabsTrigger>
        </TabsList>

        <TabsContent value='record' className='mt-6'>
          <div className='flex justify-center w-full'>
            {recorderAudioState.url ? (
              <div className='rounded-lg w-full border p-6'>
                <AudioControls
                  audioState={recorderAudioState}
                  onPlay={playAudio}
                  onDelete={handleDeleteAudio}
                  isPlaying={isPlaying}
                />
                <Waveform
                  audioUrl={recorderAudioState.url}
                  onPlayAudioReady={handlePlayAudioReady}
                />
                <div className='mt-6'>
                  <Textarea
                    placeholder='请先输入要转换的文字'
                    className='min-h-[120px] mb-4'
                  />
                </div>
              </div>
            ) : (
              <RecorderTips>
                {!isRecording ? (
                  <PulsatingButton onClick={startRecording} type='button'>
                    <span className='flex items-center dark:text-white'>
                      <Mic className='mr-2 h-4 w-4' />
                      开始录制
                    </span>
                  </PulsatingButton>
                ) : (
                  <div className='flex flex-col justify-center items-center '>
                    <PulsatingButton
                      onClick={stopRecording}
                      pulseColor='red'
                      type='button'
                      className='bg-red-600 hover:bg-red-500 
                          dark:bg-red-500 dark:hover:bg-red-400
                          '
                    >
                      <span className='flex items-center dark:text-white'>
                        <Square className='mr-2 h-4 w-4' />
                        停止录制
                      </span>
                    </PulsatingButton>
                    <div className='mt-4 font-medium text-center text-2xl'>
                      {formattedDuration}
                    </div>
                    <DurationTips duration={duration} />
                  </div>
                )}
              </RecorderTips>
            )}
          </div>
        </TabsContent>

        <TabsContent value='upload' className='mt-6'>
          <div className='flex justify-center flex-col items-center w-full gap-4'>
            {uploadAudioState.url ? (
              <div className='rounded-lg w-full border p-6'>
                <AudioControls
                  audioState={uploadAudioState}
                  onPlay={playAudio}
                  onDelete={handleDeleteAudio}
                  isPlaying={isPlaying}
                />
                <Waveform
                  audioUrl={uploadAudioState.url}
                  onPlayAudioReady={handlePlayAudioReady}
                />
                <div className='mt-6'>
                  <Textarea
                    placeholder='请先输入要转换的文字'
                    className='min-h-[120px] mb-4'
                  />
                </div>
              </div>
            ) : (
              <UploadTips>
                <Button asChild type='button' className='cursor-pointer'>
                  <label>
                    <Upload className='mr-2 h-4 w-4' />
                    上传音频文件
                    <input
                      type='file'
                      hidden
                      accept='audio/*'
                      onChange={handleFileUpload}
                    />
                  </label>
                </Button>
              </UploadTips>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AudioPlayer
