import React from 'react'
import { FileItem } from '../types'

interface ContextMenuProps {
  x: number
  y: number
  file: FileItem
  onClose: () => void
  onCopyPath: () => void
  onDelete: () => void
  onPreview: () => void
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  file,
  onClose,
  onCopyPath,
  onDelete,
  onPreview,
}) => {
  React.useEffect(() => {
    const handleClick = () => onClose()
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [onClose])

  return (
    <div
      className='fixed bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50'
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className='w-full px-4 py-2 text-left hover:bg-gray-100 text-sm'
        onClick={onPreview}
      >
        Preview
      </button>
      <button
        className='w-full px-4 py-2 text-left hover:bg-gray-100 text-sm'
        onClick={onCopyPath}
      >
        Copy Path
      </button>
      <button
        className='w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600 text-sm'
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  )
}
