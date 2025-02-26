import React, { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import fileApi from '@/apis/files'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import AudioPlayer from '../audio-player'
import { FileItem } from './types'
import { getAudioDuration } from '@/utils/audio'

interface FilePreviewProps {
  file: FileItem | null
  onClose: () => void
  currentPath: string
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onClose,
  currentPath,
}) => {
  const filePath = `${currentPath}/${file?.fileName}`
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [audioDuration, setAudioDuration] = useState<string>('')

  const downloadFileMutation = useMutation({
    mutationFn: async () => {
      const res = await fileApi.downloadFile(filePath)
      return res.data
    },
    mutationKey: ['downloadFile', filePath],
    onMutate: () => {
      toast.loading('加载中...', { id: 'download-toast' })
    },
    onSuccess: async (data) => {
      toast.success('加载成功', { id: 'download-toast' })
      const blob = new Blob([data])
      const extension = file?.fileName.split('.').pop()?.toLowerCase()
      
      if (!extension) return
      
      if (['mp3', 'wav', 'flac', 'm4a', 'ogg'].includes(extension)) {
        const url = URL.createObjectURL(blob)
        try {
          const duration = await getAudioDuration(url)
          setAudioDuration(duration)
        } catch (error) {
          console.error('Error getting audio duration:', error)
        }
        setFileContent(url)
      } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
        const url = URL.createObjectURL(blob)
        setFileContent(url)
      } else {
        const reader = new FileReader()
        reader.onload = () => {
          setFileContent(reader.result as string)
        }
        reader.readAsText(blob)
      }
    },
    onError: () => {
      toast.error('加载失败', { id: 'download-toast' })
    },
  })

  useEffect(() => {
    if (file?.fileName) {
      setAudioDuration('')
      setFileContent(null)
      downloadFileMutation.mutate()
    }
    
    return () => {
      if (fileContent && typeof fileContent === 'string' && fileContent.startsWith('blob:')) {
        URL.revokeObjectURL(fileContent)
      }
    }
  }, [file])

  const getPreviewContent = () => {
    if (!file) return null

    const extension = file.fileName.split('.').pop()?.toLowerCase()

    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
          <img
            src={fileContent || ''}
            alt={file.fileName}
            className='max-w-full max-h-[70vh] object-contain'
          />
        )
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'm4a':
        return (
          <div className='w-full flex justify-center p-4'>
            <AudioPlayer
              audioState={{
                url: fileContent,
                duration: audioDuration,
                name: file.fileName,
              }}
            />
          </div>
        )
      case 'pdf':
        return (
          <iframe
            src={fileContent || ''}
            className='w-full h-[70vh]'
            title={file.fileName}
          />
        )
      case 'txt':
      case 'md':
      case 'json':
      case 'log':
      case 'yml':
      case 'yaml':
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
      case 'html':
      case 'css':
      case 'scss':
      case 'less':
      case 'xml':
        return (
          <SyntaxHighlighter
            language={extension}
            style={materialLight}
            className='h-[70vh] overflow-auto p-4 bg-gray-50 rounded w-full break-words'
          >
            {fileContent}
          </SyntaxHighlighter>
        )
      case 'mp4':
      case 'webm':
        return (
          <video src={fileContent || ''} controls className='w-full h-[70vh]' />
        )
      default:
        return (
          <div className='text-center p-8'>
            Preview not available for this file type
          </div>
        )
    }
  }

  return (
    <Dialog open={!!file?.fileName} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='max-w-4xl'>
        <DialogHeader>
          <DialogTitle>{file?.fileName}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className='mt-4 w-full overflow-auto'>{getPreviewContent()}</div>
      </DialogContent>
    </Dialog>
  )
}
