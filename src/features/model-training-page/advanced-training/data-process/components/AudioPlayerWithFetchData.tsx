import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import fileApi from '@/apis/files'
import AudioPlayer from '@/components/audio-player'

type AudioPlayerWithFetchDataProps = {
  filePath: string
  name: string
}

export default function AudioPlayerWithFetchData({
  filePath,
  name,
}: AudioPlayerWithFetchDataProps) {
  const [fileContent, setFileContent] = useState<string | null>(null)
  const downloadFileMutation = useMutation({
    mutationFn: async () => {
      const res = await fileApi.downloadFile(filePath)
      return res.data
    },
    mutationKey: ['downloadFile', filePath],
    onSuccess: (data) => {
      const handleFileContent = (data: any) => {
        const blob = new Blob([data])
        const extension = filePath.split('.').pop()?.toLowerCase()
        if (!extension) return
        if (
          [
            'mp3',
            'wav',
            'flac',
            'm4a',
            'ogg',
            'jpg',
            'jpeg',
            'png',
            'gif',
          ].includes(extension)
        ) {
          const url = URL.createObjectURL(blob)
          setFileContent(url)
          return
        } else {
          const reader = new FileReader()
          reader.onload = () => {
            setFileContent(reader.result as string)
          }
          reader.readAsText(blob)
        }
      }

      handleFileContent(data)
    },
  })

  useEffect(() => {
    downloadFileMutation.mutate()
  }, [])

  return (
    <AudioPlayer
      audioState={{
        url: fileContent,
        duration: '',
        name: name,
      }}
    />
  )
}
