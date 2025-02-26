import React, { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import fileApi, { RequestBody } from '@/apis/files'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'
import { useNamespaceStore } from '@/stores/namespaceStore'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { FileUploader, FileInput } from '../ui/file-uploader'
import AudioPlayback from './AudioPlayback'
import AudioRecorder from './AudioRecorder'
import { UploadTips } from './UploadTips'
import { AudioState } from './type'
import { useAudioUpload } from '@/hooks/use-audio-upload'
import { getAudioDuration, fileToBase64 } from '@/utils/audio'

type AudioRecordPlayerProps = {
  onAudioStateChange: (audioState: AudioState) => void
  text: React.ReactNode
}
function AudioRecordPlayer({ onAudioStateChange, text }: AudioRecordPlayerProps) {
  const { currentNamespace } = useNamespaceStore()
  const [activeTab, setActiveTab] = useState('record')
  const [audioState, setAudioState] = useState<Record<string, AudioState>>({
    record: { url: null, duration: '0s', name: 'recording.wav' },
    upload: { url: null, duration: '0s', name: 'upload.wav' },
  })

  const currentAudioPath = currentNamespace?.homePath + '/voices' || '/'
  const uploadMutation = useAudioUpload(currentAudioPath)

  const handleFileChange = useCallback(
    async (files: File[] | null) => {
      try {
        const file = files?.[0]
        if (!file || !file.type.startsWith('audio/')) {
          throw new Error('请选择音频文件')
        }

        const url = URL.createObjectURL(file)
        const duration = await getAudioDuration(file)
        const newAudioState = { url, duration, name: file.name }
        
        setAudioState(prev => ({
          ...prev,
          upload: newAudioState
        }))

        const base64data = await fileToBase64(file)
        await uploadMutation.mutateAsync({
          directoryPath: currentAudioPath,
          fileName: file.name,
          fileContent: base64data,
        })

        onAudioStateChange(newAudioState)
      } catch (error) {
        console.error('Error handling audio file:', error)
        toast.error('音频处理失败')
      }
    },
    [currentAudioPath, onAudioStateChange, uploadMutation]
  )

  const handleRecordingComplete = async (audioState: AudioState) => {
    try {
      if (!audioState.url) return

      const response = await fetch(audioState.url)
      const blob = await response.blob()
      const file = new File([blob], audioState.name, { type: blob.type })
      
      // 先计算时长，避免上传过程中阻塞
      const duration = await getAudioDuration(audioState.url)
      const newAudioState = { ...audioState, duration }
      
      setAudioState(prev => ({
        ...prev,
        record: newAudioState
      }))

      const base64data = await fileToBase64(file)
      await uploadMutation.mutateAsync({
        directoryPath: currentAudioPath,
        fileName: file.name,
        fileContent: base64data,
      })

      onAudioStateChange(newAudioState)
    } catch (error) {
      console.error('Error handling recorded audio:', error)
      toast.error('录音处理失败')
    }
  }

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
              <AudioRecorder onRecordingComplete={handleRecordingComplete} />
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
                    <div className='p-4 rounded-full bg-blue-50 dark:bg-blue-900/30'>
                      <Upload className='h-8 w-8 text-blue-500 dark:text-blue-400' />
                    </div>
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
