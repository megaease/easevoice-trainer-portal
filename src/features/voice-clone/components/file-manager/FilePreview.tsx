import React, { useRef, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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

  if (!file) return null

  const getPreviewContent = () => {
    const extension = file.name.split('.').pop()?.toLowerCase()

    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
          <img
            src={`data:image/${extension};base64,${file.content}`}
            alt={file.name}
            className='max-w-full max-h-[70vh] object-contain'
          />
        )
      case 'mp3':
      case 'wav':
      case 'ogg':
        return (
          <div className='w-full flex justify-center p-4'>
            <audio ref={audioRef} controls className='w-full max-w-md'>
              <source
                src={`data:audio/${extension};base64,${file.content}`}
                type={`audio/${extension}`}
              />
              Your browser does not support the audio element.
            </audio>
          </div>
        )
      case 'pdf':
        return (
          <iframe
            src={`data:application/pdf;base64,${file.content}`}
            className='w-full h-[70vh]'
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
    <Dialog open={!!file} onOpenChange={() => onClose()}>
      <DialogContent className='max-w-4xl'>
        <DialogHeader>
          <DialogTitle>{file.name}</DialogTitle>
        </DialogHeader>
        <div className='mt-4'>{getPreviewContent()}</div>
      </DialogContent>
    </Dialog>
  )
}
