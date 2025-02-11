import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import fileApi from '@/apis/files'
import { fetchFolderContents, uploadFiles, deleteFiles } from '@/apis/files'
import { ScrollArea } from '../ui/scroll-area'
import { Separator } from '../ui/separator'
import { Skeleton } from '../ui/skeleton'
import { FileBreadcrumb } from './FileBreadcrumb'
import { FileList } from './FileList'
import { FilePreview } from './FilePreview'
import { FolderList } from './FolderList'
import { Toolbar } from './Toolbar'
import { DeleteDialog } from './delete-dialog'
import { NewFileDialog } from './new-file-dialog'
import { NewFolderDialog } from './new-folder-dialog'
import { FileItem, FolderItem } from './types'

function FileManager() {
  const [currentPath, setCurrentPath] = useState('/')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null)

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deleteIds, setDeleteIds] = useState<string[]>([])
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false)
  const [newFileDialogOpen, setNewFileDialogOpen] = useState(false)

  const queryClient = useQueryClient()

  // 查询当前文件夹内容
  const {
    data = [],
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['files', currentPath],
    queryFn: async () => {
      const res = await fileApi.getFolderContents(currentPath)
      return res.data
    },
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
      // queryClient.setQueryData(['files', currentPath], (old: FileItem[] = []) =>
      //   old.filter((file) => !deleteIds.includes(file.id))
      // )
      setSelectedItems([])
      setOpenDeleteDialog(false)
    },
  })

  const handleSelect = (name: string) => {
    if (selectedItems.includes(name)) {
      setSelectedItems(selectedItems.filter((item) => item !== name))
    } else {
      setSelectedItems([...selectedItems, name])
    }
  }

  const handleOpen = (item: FileItem | FolderItem) => {
    if (item.type === 'directory') {
      setCurrentPath(data.directoryPath + item.directoryName)
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

  console.log('data', data)
  return (
    <div className='h-full max-w-7xl mx-auto shadow-sm flex flex-col'>
      <Toolbar
        onNewFolder={() => {
          setNewFolderDialogOpen(true)
        }}
        onNewFile={() => setNewFileDialogOpen(true)}
        onDelete={() => {
          setDeleteIds(selectedItems)
          setOpenDeleteDialog(true)
        }}
        onUpload={handleUpload}
        onDownload={() => alert('Download')}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        hasSelection={selectedItems.length > 0}
        isLoading={
          isFetching || uploadMutation.isPending || deleteMutation.isPending
        }
        onRefresh={() => refetch()}
      />
      <div className='px-4 py-2'>
        <FileBreadcrumb path={currentPath} onNavigate={handleNavigate} />
      </div>
      <Separator />
      <ScrollArea className='flex-1'>
        <div className='p-4 space-y-2'>
          <FolderList
            folders={data.directories || []}
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
          <FileList
            files={data.files || []}
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
        </div>
      </ScrollArea>

      <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
      {/* <DeleteDialog
        selectedFiles={[...data?.files, ...data?.directories].filter((file) =>
          deleteIds.includes(file.id)
        )}
        isOpen={openDeleteDialog}
        isLoading={deleteMutation.isPending}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={() => handleDelete(selectedItems)}
      /> */}
      <NewFileDialog
        isOpen={newFileDialogOpen}
        onClose={() => {
          setNewFileDialogOpen(false)
        }}
        onConfirm={(name) => {}}
      />
      <NewFolderDialog
        isOpen={newFolderDialogOpen}
        onClose={() => {
          setNewFolderDialogOpen(false)
        }}
        onConfirm={(name) => {}}
      />
    </div>
  )
}

export default FileManager
