import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import fileApi from '@/apis/files'
import AudioPlayer from '@/components/audio-player'
import { getAudioDuration } from '@/utils/audio'

type AudioPlayerWithFetchDataProps = {
  filePath: string
  name: string
}

export default function AudioPlayerWithFetchData({
  filePath,
  name,
}: AudioPlayerWithFetchDataProps) {
  const [audioState, setAudioState] = useState({
    url: null as string | null,
    duration: '',
    name,
  })

  const downloadFileMutation = useMutation({
    mutationFn: async () => {
      const res = await fileApi.downloadFile(filePath)
      return res.data
    },
    mutationKey: ['downloadFile', filePath],
    onMutate: () => {
      toast.loading('加载音频中...', { id: 'audio-toast' })
    },
    onSuccess: async (data) => {
      try {
        const blob = new Blob([data])
        const extension = filePath.split('.').pop()?.toLowerCase()
        
        if (!extension || !['mp3', 'wav', 'flac', 'm4a', 'ogg'].includes(extension)) {
          throw new Error('不支持的音频格式')
        }

        const url = URL.createObjectURL(blob)
        const duration = await getAudioDuration(url)
        
        setAudioState(prev => ({
          ...prev,
          url,
          duration,
        }))
        
        toast.success('音频加载成功', { id: 'audio-toast' })
      } catch (error) {
        console.error('Error processing audio:', error)
        toast.error('音频处理失败', { id: 'audio-toast' })
      }
    },
    onError: () => {
      toast.error('音频加载失败', { id: 'audio-toast' })
    },
  })

  useEffect(() => {
    downloadFileMutation.mutate()
    
    return () => {
      if (audioState.url) {
        URL.revokeObjectURL(audioState.url)
      }
    }
  }, [filePath])

  return <AudioPlayer audioState={audioState} />
}
