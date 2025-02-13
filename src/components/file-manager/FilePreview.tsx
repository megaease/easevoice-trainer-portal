import React, { useRef, useEffect } from 'react'
import audioSrc from '@/assets/test.mp3'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import AudioPlayer from '../audio-player'
import { FileItem } from './types'

interface FilePreviewProps {
  file: FileItem | null
  onClose: () => void
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, onClose }) => {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load()
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
        return null
      // return (
      //   <img
      //     src={file.content}
      //     alt={file.fileName}
      //     className='max-w-full max-h-[70vh] object-contain'
      //   />
      // )
      case 'mp3':
      case 'wav':
      case 'ogg':
        return (
          <div className='w-full flex justify-center p-4'>
            <AudioPlayer
              audioState={{
                url: audioSrc,
                duration: '0s',
                name: file.fileName,
              }}
            />
          </div>
        )
      case 'pdf':
        return (
          <iframe
            src={file.content}
            className='w-full h-[70vh]'
            title={file.fileName}
          />
        )
      case 'txt':
      case 'md':
      case 'json':
        return (
          <pre className='w-full h-[70vh] overflow-auto p-4 bg-gray-50 rounded'>
            {file.content}
          </pre>
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
    <Dialog open={!!file} onOpenChange={(open) => !open && onClose()}>
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
