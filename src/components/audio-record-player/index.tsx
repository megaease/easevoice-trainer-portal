import React, { useState, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import fileApi, { RequestBody } from '@/apis/files'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'
import { useNamespaceStore } from '@/stores/namespaceStore'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  FileUploader,
  FileInput,
} from '../ui/file-uploader'
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
  const [activeTab, setActiveTab] = useState('record')
  const [audioState, setAudioState] = useState<Record<string, AudioState>>({
    record: { url: null, duration: '0s', name: 'recording.wav' },
    upload: { url: null, duration: '0s', name: 'upload.wav' },
  })

  const currentAudioPath = currentNamespace?.homePath + '/voices' || '/'
  const queryClient = useQueryClient()
  const uploadMutation = useMutation({
    mutationFn: (data: RequestBody) => {
      return fileApi.uploadFiles(data)
    },
    onMutate: () => {
      return toast.loading('上传中', {
        id: 'upload-toast',
      })
    },
    onSuccess: () => {
      toast.success('上传成功', {
        id: 'upload-toast',
      })
    },
    onError: () => {
      toast.error('上传失败', {
        id: 'upload-toast',
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries(
        {
          queryKey: ['files', currentAudioPath],
          exact: true,
          refetchType: 'active',
        },
        { throwOnError: true, cancelRefetch: true }
      )
    },
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

        // Convert the audio file to base64
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = async () => {
          let base64data = reader.result as string
          base64data = base64data.split(',')[1] // Remove the data URL prefix
          try {
            const requestBody: RequestBody = {
              directoryPath: currentAudioPath,
              fileName: file.name,
              fileContent: base64data,
            }
            await uploadMutation.mutateAsync(requestBody)

            onAudioStateChange({ url, duration, name: file.name })
          } catch (error) {
            console.error('Error uploading audio:', error)
          }
        }
      } catch (error) {
        console.error('Error loading audio:', error)
      }
    },
    [onAudioStateChange]
  )

  const handleRecordingComplete = async (audioState: AudioState) => {
    try {
      if (!audioState.url) {
        throw new Error('Audio URL is null')
      }
      const response = await fetch(audioState.url)
      const blob = await response.blob()
      const file = new File([blob], audioState.name, { type: blob.type })

      // Convert the recorded audio file to base64
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = async () => {
        let base64data = reader.result as string
        base64data = base64data.split(',')[1] // Remove the data URL prefix
        try {
          const requestBody: RequestBody = {
            directoryPath: currentAudioPath,
            fileName: file.name,
            fileContent: base64data,
          }
          await uploadMutation.mutateAsync(requestBody)
          onAudioStateChange(audioState)
          setAudioState((prev) => ({
            ...prev,
            record: audioState,
          }))
        } catch (error) {
          console.error('Error uploading recorded audio:', error)
        }
      }
    } catch (error) {
      console.error('Error uploading recorded audio:', error)
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
