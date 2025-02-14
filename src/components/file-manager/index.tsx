import { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import fileApi, { RequestBody } from '@/apis/files'
import { toast } from 'sonner'
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
import { NewFolderDialog } from './new-folder-dialog'
import { FileItem, FolderItem, FileListType } from './types'

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

  const {
    data = { files: [], directories: [], directoryPath: 'currentPath' },
    isFetching,
    refetch,
  } = useQuery<FileListType>({
    queryKey: ['files', currentPath],
    queryFn: async () => {
      try {
        const res = await fileApi.getFolderContents(currentPath)
        return res.data
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
    mutationFn: (data: RequestBody) => {
      return fileApi.uploadFiles(data)
    },
    onMutate: () => {
      return toast.loading('上传中', {
        id: 'upload-toast',
      })
    },
    onSuccess: () => {
      toast.success('上传成功', {
        id: 'upload-toast',
      })
    },
    onError: (error) => {
      toast.error('上传失败', {
        id: 'upload-toast',
      })
    },
    onSettled: () => {
      refetch()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (paths: string[]) => fileApi.deleteFileAndFolders(paths),
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
  const handleDelete = () => {
    deleteMutation.mutate(deletePaths)
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
    } else {
      setPreviewFile(item)
    }
    setSelectedItems([])
  }

  const handleNavigate = (path: string) => {
    setCurrentPath(path)
    setSelectedItems([])
  }

  const handleUpload = async (data: RequestBody) => {
    await uploadMutation.mutateAsync(data)
  }

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode)
  }
  const handleCopyPath = (name: string) => {
    const path = getPath(name, currentPath)
    navigator.clipboard.writeText(path)
  }

  return (
    <div className='h-full max-w-7xl mx-auto shadow-sm flex flex-col'>
      <Toolbar
        onNewFolder={() => {
          setNewFolderDialogOpen(true)
        }}
        onDelete={() => {
          setDeletePaths(
            selectedItems.map((name) => getPath(name, currentPath))
          )
          setOpenDeleteDialog(true)
        }}
        onUpload={handleUpload}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        hasSelection={selectedItems.length > 0}
        isLoading={
          isFetching || uploadMutation.isPending || deleteMutation.isPending
        }
        onRefresh={() => refetch()}
        onHome={() => setCurrentPath(currentNamespace?.homePath || '/')}
        currentPath={currentPath}
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

      <DeleteDialog
        deletePaths={deletePaths}
        isOpen={openDeleteDialog}
        isLoading={deleteMutation.isPending}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={() => handleDelete()}
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
      {previewFile ? (
        <FilePreview
          currentPath={currentPath}
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      ) : null}
    </div>
  )
}

export default FileManager
