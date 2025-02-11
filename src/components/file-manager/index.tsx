import React, { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import fileApi from '@/apis/files'
import { fetchFolderContents, uploadFiles, deleteFiles } from '@/apis/files'
import { useNamespaceStore } from '@/stores/namespaceStore'
import { cn } from '@/lib/utils'
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

function getPath(name: string, currentPath: string) {
  return currentPath === '/' ? currentPath + name : currentPath + '/' + name
}
function FileManager() {
  const { currentNamespace } = useNamespaceStore()
  const [currentPath, setCurrentPath] = useState(
    currentNamespace?.homePath || '/'
  )
  useEffect(() => {
    setCurrentPath(currentNamespace?.homePath || '/')
  }, [currentNamespace])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null)

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [deletePaths, setDeletePaths] = useState<string[]>([])
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false)
  console.log(currentNamespace, currentPath, 'currentPath')
  const queryClient = useQueryClient()

  // 查询当前文件夹内容
  const {
    data = { files: [], directories: [] },
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['files', currentPath],
    queryFn: async () => {
      try {
        const res = await fileApi.getFolderContents(currentPath)
        return {
          files: res.data.files || [],
          directories: res.data.directories || [],
        }
      } catch (error) {
        console.error('Error fetching folder contents:', error)
        return {
          files: [],
          directories: [],
        }
      }
    },
    placeholderData: (previousData) => previousData,
  })

  const uploadMutation = useMutation({
    mutationFn: (newFiles: File[]) => uploadFiles(currentPath, newFiles),
    onSuccess: (newFiles) => {
      queryClient.setQueryData(
        ['files', currentPath],
        (old: FileItem[] = []) => [...old, ...newFiles]
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (paths: string[]) => fileApi.deleteFiles(paths),
    onSuccess: () => {
      setDeletePaths([])
      setSelectedItems([])
      setOpenDeleteDialog(false)
    },
    onSettled: () => {
      refetch()
    },
  })
  const newFolderMutation = useMutation({
    mutationFn: (path: string) => fileApi.createFolder(path),
    onSuccess: () => {
      setNewFolderDialogOpen(false)
    },
    onSettled: () => {
      refetch()
    },
  })
  const handleDelete = (names: string[]) => {
    const paths = names.map((name) => getPath(name, currentPath))
    deleteMutation.mutate(paths)
  }
  const handleNewFolder = async (name: string) => {
    const path = getPath(name, currentPath)
    await newFolderMutation.mutateAsync(path)
    setNewFolderDialogOpen(false)
  }

  const handleSelect = (name: string) => {
    if (selectedItems.includes(name)) {
      setSelectedItems(selectedItems.filter((item) => item !== name))
    } else {
      setSelectedItems([...selectedItems, name])
    }
  }

  const handleOpen = (item: FileItem | FolderItem) => {
    if (item.type === 'directory') {
      const path = getPath(item.directoryName, currentPath)
      setCurrentPath(path)
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
  const handleCopyPath = (name: string) => {
    const path = getPath(name, currentPath)
    navigator.clipboard.writeText(path)
  }
  console.log(deletePaths, 'deletePaths')
  return (
    <div className='h-full max-w-7xl mx-auto shadow-sm flex flex-col'>
      <Toolbar
        onNewFolder={() => {
          setNewFolderDialogOpen(true)
        }}
        onDelete={() => {
          setDeletePaths(selectedItems)
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
        {isFetching ? (
          <div
            className={cn(
              'transition-all duration-300 ease-in-out p-4 h-full',
              viewMode === 'grid'
                ? 'flex flex-wrap flex-row gap-4'
                : 'flex flex-col space-y-2'
            )}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className={cn(
                  'rounded-lg bg-slate-100 dark:bg-gray-700',
                  viewMode === 'grid' ? 'w-[150px] h-20' : 'w-full h-10'
                )}
              ></Skeleton>
            ))}
          </div>
        ) : (
          <div
            className={cn(
              'transition-all duration-300 ease-in-out h-full p-4',
              viewMode === 'grid'
                ? 'flex flex-wrap flex-row gap-4'
                : 'flex flex-col space-y-2'
            )}
          >
            <FolderList
              folders={data.directories || []}
              selectedItems={selectedItems}
              viewMode={viewMode}
              onSelect={handleSelect}
              onOpen={handleOpen}
              onDelete={(item: FolderItem) => {
                const path = getPath(item.directoryName, currentPath)
                setDeletePaths([path])
                setOpenDeleteDialog(true)
              }}
              isLoading={
                isFetching ||
                uploadMutation.isPending ||
                deleteMutation.isPending
              }
              handleCopyPath={handleCopyPath}
            />
            <FileList
              files={data.files || []}
              selectedItems={selectedItems}
              viewMode={viewMode}
              onSelect={handleSelect}
              onOpen={handleOpen}
              onDelete={(item: FileItem) => {
                const path = getPath(item.fileName, currentPath)
                setDeletePaths([path])
                setOpenDeleteDialog(true)
              }}
              isLoading={
                isFetching ||
                uploadMutation.isPending ||
                deleteMutation.isPending
              }
              handleCopyPath={handleCopyPath}
            />
          </div>
        )}
      </ScrollArea>

      <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
      <DeleteDialog
        deletePaths={deletePaths}
        isOpen={openDeleteDialog}
        isLoading={deleteMutation.isPending}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={() => handleDelete(selectedItems)}
      />

      <NewFolderDialog
        isOpen={newFolderDialogOpen}
        onClose={() => {
          setNewFolderDialogOpen(false)
        }}
        onConfirm={(name) => {
          handleNewFolder(name)
        }}
      />
    </div>
  )
}

export default FileManager
