import React, { useState, useCallback } from 'react'
import { Play, Square, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { AudioControls } from './AudioControls'
import { Waveform } from './Waveform'
import { useAudioRecorder } from './hooks/useAudioRecorder'

function AudioPlayer() {
  const [activeTab, setActiveTab] = useState('record')
  const {
    isRecording,
    audioState,
    startRecording,
    stopRecording,
    setAudioState,
  } = useAudioRecorder()
  const [playAudio, setPlayAudio] = useState<() => void>(() => {})

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      const duration = `${(file.size / 32000).toFixed(1)}s` // 粗略估计
      setAudioState({ url, duration, name: file.name })
    }
  }

  const handleDeleteAudio = () => {
    setAudioState({ url: null, duration: '0s', name: 'recording.wav' })
  }

  const handlePlayAudioReady = useCallback((playFunction: () => void) => {
    setPlayAudio(() => playFunction)
  }, [])

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
          <div className='flex justify-center'>
            {!isRecording ? (
              <Button
                onClick={startRecording}
                className='bg-indigo-600 hover:bg-indigo-700'
                type='button'
              >
                <Play className='mr-2 h-4 w-4' />
                开始录制
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                variant='destructive'
                type='button'
              >
                <Square className='mr-2 h-4 w-4' />
                停止录制
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value='upload' className='mt-6'>
          <div className='flex justify-center'>
            <Button asChild type='button'>
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
          </div>
        </TabsContent>
      </Tabs>

      {audioState.url && (
        <div className='mt-8 bg-white rounded-lg p-6'>
          <AudioControls
            audioState={audioState}
            onPlay={playAudio}
            onDelete={handleDeleteAudio}
          />

          <Waveform
            audioUrl={audioState.url}
            onPlayAudioReady={handlePlayAudioReady}
          />

          <div className='mt-6'>
            <Textarea
              placeholder='请先输入要转换的文字'
              className='min-h-[120px] mb-4'
            />
            <Button className='w-full bg-indigo-600 hover:bg-indigo-700'>
              生成
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AudioPlayer
