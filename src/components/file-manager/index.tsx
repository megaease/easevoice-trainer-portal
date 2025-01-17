import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchFolderContents, uploadFiles, deleteFiles } from '@/apis/files'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
import { Skeleton } from '../ui/skeleton'
import { Breadcrumb } from './Breadcrumb'
import { FileList } from './FileList'
import { FilePreview } from './FilePreview'
import { Toolbar } from './Toolbar'
import { DeleteDialog } from './delete-dialog'
import { FileItem } from './types'

function FileManager() {
  const [currentPath, setCurrentPath] = useState('/')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null)

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deleteIds, setDeleteIds] = useState<string[]>([])

  const queryClient = useQueryClient()

  // 查询当前文件夹内容
  const { data: files = [], isFetching } = useQuery({
    queryKey: ['files', currentPath],
    queryFn: () => fetchFolderContents(currentPath),
    placeholderData: (previousData) => previousData,
  })

  // 上传文件的 mutation
  const uploadMutation = useMutation({
    mutationFn: (newFiles: File[]) => uploadFiles(currentPath, newFiles),
    onSuccess: (newFiles) => {
      queryClient.setQueryData(
        ['files', currentPath],
        (old: FileItem[] = []) => [...old, ...newFiles]
      )
    },
  })
  const handleDelete = (ids: string[]) => {
    deleteMutation.mutate(ids)
  }
  // 删除文件的 mutation
  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => deleteFiles(currentPath, ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', currentPath] })
      setSelectedItems([])
    },
  })

  const handleSelect = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleOpen = (item: FileItem) => {
    if (item.type === 'folder') {
      setCurrentPath(item.path)
      setSelectedItems([])
    } else {
      setPreviewFile(item)
    }
  }

  const handleNavigate = (path: string) => {
    setCurrentPath(path)
    setSelectedItems([])
  }

  const handleUpload = async (files: File[]) => {
    await uploadMutation.mutateAsync(files)
  }

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
  }

  return (
    <div className='h-full max-w-7xl mx-auto shadow-sm flex flex-col'>
      <Toolbar
        onNewFolder={() => {
          const name = prompt('Enter folder name:')
          if (name) {
            const newFolder: FileItem = {
              id: Date.now().toString(),
              name,
              type: 'folder',
              lastModified: new Date(),
              path: `${currentPath}/${name}`,
            }
            queryClient.setQueryData(
              ['files', currentPath],
              (old: FileItem[] = []) => [...old, newFolder]
            )
          }
        }}
        onNewFile={() => alert('New file')}
        onDelete={() => {
          setDeleteIds(selectedItems)
          setOpenDeleteDialog(true)
        }}
        onUpload={handleUpload}
        onDownload={() => alert('Download')}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        hasSelection={selectedItems.length > 0}
        isLoading={uploadMutation.isPending || deleteMutation.isPending}
      />
      <Breadcrumb path={currentPath} onNavigate={handleNavigate} />
      <Separator />
      <ScrollArea className='flex-1'>
        <FileList
          files={files}
          selectedItems={selectedItems}
          viewMode={viewMode}
          onSelect={handleSelect}
          onOpen={handleOpen}
          onDelete={(ids) => {
            setDeleteIds(ids)
            setOpenDeleteDialog(true)
          }}
          isLoading={
            isFetching || uploadMutation.isPending || deleteMutation.isPending
          }
        />
      </ScrollArea>

      <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
      <DeleteDialog
        selectedFiles={files.filter((file) => deleteIds.includes(file.id))}
        isOpen={openDeleteDialog}
        isLoading={deleteMutation.isPending}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={() => handleDelete(selectedItems)}
      />
    </div>
  )
}

export default FileManager
