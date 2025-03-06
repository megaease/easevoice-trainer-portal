import React, { useEffect, useCallback } from 'react'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'
import { useAudioStore } from '@/stores/audioStore'
import { useNamespaceStore } from '@/stores/namespaceStore'
import { fileToBase64, getAudioDuration } from '@/utils/audio'
import { useAudioUpload } from '@/hooks/use-audio-upload'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { FileUploader, FileInput } from '../ui/file-uploader'
import AudioPlayback from './AudioPlayback'
import AudioRecorder from './AudioRecorder'
import { UploadTips } from './UploadTips'
import { AudioState } from './type'

type AudioRecordPlayerProps = {
  onAudioStateChange: (audioState: AudioState) => void
  text: React.ReactNode
}

function AudioRecordPlayer({
  onAudioStateChange,
  text,
}: AudioRecordPlayerProps) {
  const { currentNamespace } = useNamespaceStore()
  const currentAudioPath = currentNamespace?.homePath + '/voices' || '/'
  const uploadMutation = useAudioUpload(currentAudioPath)

  const {
    activeTab,
    audioStates,
    setActiveTab,
    updateAudioState,
    deleteAudio,
    resetStore,
  } = useAudioStore()

  const handleAudioUpload = useCallback(
    async (file: File, audioState: AudioState) => {
      try {
        const base64data = await fileToBase64(file)
        await uploadMutation.mutateAsync({
          directoryPath: currentAudioPath,
          fileName: file.name,
          fileContent: base64data,
        })

        updateAudioState(activeTab as 'record' | 'upload', audioState)
        if (audioState.url) {
          onAudioStateChange(audioState)
        }
      } catch (error) {
        console.error('Error uploading audio:', error)
        toast.error('音频上传失败')
      }
    },
    [
      activeTab,
      currentAudioPath,
      onAudioStateChange,
      updateAudioState,
      uploadMutation,
    ]
  )

  const handleFileChange = useCallback(
    async (files: File[] | null) => {
      try {
        const file = files?.[0]
        if (!file || !file.type.startsWith('audio/')) {
          throw new Error('请选择音频文件')
        }

        const url = URL.createObjectURL(file)
        const duration = await getAudioDuration(file)
        const audioState = { url, duration, name: file.name }

        await handleAudioUpload(file, audioState)
      } catch (error) {
        console.error('Error handling audio file:', error)
        toast.error('音频处理失败')
      }
    },
    [handleAudioUpload]
  )

  const handleRecordingComplete = useCallback(
    async (audioState: AudioState) => {
      try {
        if (!audioState.url) return

        const response = await fetch(audioState.url)
        const blob = await response.blob()
        const file = new File([blob], 'recording.wav', { type: blob.type })
        const duration = await getAudioDuration(file)
        const updatedState = { ...audioState, duration }

        await handleAudioUpload(file, updatedState)
      } catch (error) {
        console.error('Error handling recorded audio:', error)
        toast.error('录音处理失败')
      }
    },
    [handleAudioUpload]
  )

  useEffect(() => {
    const currentAudioState = audioStates[activeTab as 'record' | 'upload']
    if (currentAudioState?.url) {
      onAudioStateChange(currentAudioState)
    }
  }, [audioStates, activeTab, onAudioStateChange])

  useEffect(() => {
    return () => {
      resetStore()
    }
  }, [resetStore])

  const recorderAudioState = audioStates.record
  const uploadAudioState = audioStates.upload

  return (
    <div className='max-w-3xl mx-auto'>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab as (value: string) => void}
        className='w-full'
      >
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
                  handleDeleteAudio={deleteAudio}
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
                  handleDeleteAudio={deleteAudio}
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
