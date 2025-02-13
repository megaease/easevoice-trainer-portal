import React, { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import fileApi from '@/apis/files'
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

  useEffect(() => {
    if (file && file.fileName) {
      downloadFileMutation.mutate()
    }
  }, [file])

  const downloadFileMutation = useMutation({
    mutationFn: async () => {
      const res = await fileApi.downloadFile(filePath)
      return res.data
    },
    mutationKey: ['downloadFile', filePath],
    onMutate: () => {
      toast.loading('加载中...', {
        id: 'download-toast',
      })
    },
    onSuccess: (data) => {
      toast.success('加载成功', {
        id: 'download-toast',
      })
      const handleFileContent = (data: any) => {
        const blob = new Blob([data])
        const extension = file?.fileName.split('.').pop()?.toLowerCase()
        if (!extension) return
        if (
          ['mp3', 'wav', 'ogg', 'jpg', 'jpeg', 'png', 'gif'].includes(extension)
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
    onError: () => {
      toast.error('加载失败', {
        id: 'download-toast',
      })
    },
  })

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
      case 'ogg':
        return (
          <div className='w-full flex justify-center p-4'>
            <AudioPlayer
              audioState={{
                url: fileContent,
                duration: '0s',
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
        return (
          <pre className='h-[70vh] overflow-auto p-4 bg-gray-50 rounded w-full break-words'>
            {fileContent}
          </pre>
        )
      case 'html':
        return (
          <iframe
            src={fileContent || ''}
            className='w-full h-[70vh]'
            title={file.fileName}
          />
        )
      case 'mp4':
      case 'webm':
      case 'ogg':
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
      <DialogContent className='max-w-4xl w-[90vw]'>
        <DialogHeader>
          <DialogTitle>{file?.fileName}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className='mt-4'>{getPreviewContent()}</div>
      </DialogContent>
    </Dialog>
  )
}
