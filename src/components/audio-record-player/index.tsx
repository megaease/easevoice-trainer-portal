import React, { useState, useEffect, useCallback } from 'react'
import { CloudUpload, Paperclip, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from '../ui/file-uploader'
import AudioPlayback from './AudioPlayback'
import AudioRecorder from './AudioRecorder'
import { UploadTips } from './UploadTips'
import { AudioState } from './type'

type AudioRecordPlayerProps = {
  onAudioStateChange: (audioState: AudioState) => void
  text: React.ReactNode
  audioState: AudioState
}
function AudioRecordPlayer({
  onAudioStateChange,
  text,
}: AudioRecordPlayerProps) {
  const [activeTab, setActiveTab] = useState('record')
  const [audioState, setAudioState] = useState<Record<string, AudioState>>({
    record: { url: null, duration: '0s', name: 'recording.wav' },
    upload: { url: null, duration: '0s', name: 'upload.wav' },
  })

  const handleFileChange = useCallback(
    async (files: File[] | null) => {
      try {
        const file = files?.[0]
        if (!file) return

        if (!file.type.startsWith('audio/')) {
          throw new Error('Please select an audio file')
        }

        const url = URL.createObjectURL(file)

        const duration = await new Promise<string>((resolve, reject) => {
          const audio = new Audio(url)

          audio.addEventListener('loadedmetadata', () => {
            resolve(`${Math.round(audio.duration)}s`)
          })

          audio.addEventListener('error', () => {
            reject(new Error('Failed to load audio file'))
          })
        })
        console.log('duration', duration)
        setAudioState((prev) => ({
          ...prev,
          upload: { url, duration, name: file.name },
        }))

        onAudioStateChange({ url, duration, name: file.name })
      } catch (error) {
        console.error('Error loading audio:', error)
      }
    },
    [onAudioStateChange]
  )

  const handleDeleteAudio = () => {
    setAudioState((prev) => ({
      ...prev,
      [activeTab]: { url: null, duration: '0s', name: 'recording.wav' },
    }))
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
            {recorderAudioState?.url ? (
              <div className='rounded-lg w-full border p-6'>
                <AudioPlayback
                  audioState={recorderAudioState}
                  handleDeleteAudio={handleDeleteAudio}
                />
                <div className='mt-6'>{text}</div>
              </div>
            ) : (
              <AudioRecorder
                onRecordingComplete={(audioState) => {
                  onAudioStateChange(audioState)
                  setAudioState((prev) => ({
                    ...prev,
                    record: audioState,
                  }))
                }}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value='upload' className='mt-6'>
          <div className='flex justify-center flex-col items-center w-full gap-4'>
            {uploadAudioState.url ? (
              <div className='rounded-lg w-full border p-6'>
                <AudioPlayback
                  audioState={uploadAudioState}
                  handleDeleteAudio={handleDeleteAudio}
                />
                <div className='mt-6'>{text}</div>
              </div>
            ) : (
              <FileUploader
                value={null}
                onValueChange={handleFileChange}
                dropzoneOptions={{
                  maxFiles: 1,
                  maxSize: 1024 * 1024 * 4,
                  multiple: true,
                }}
                className='h-full bg-background rounded-lg p-2'
              >
                <FileInput id='fileInput' className='w-full'>
                  <UploadTips>
                    <Button type='button'>
                      <>
                        <Upload className='mr-2 h-4 w-4' />
                        上传音频文件
                      </>
                    </Button>
                  </UploadTips>
                </FileInput>
              </FileUploader>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AudioRecordPlayer
