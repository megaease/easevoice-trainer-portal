import { useState } from 'react'
import { CustomBreadcrumb } from './Breadcrumb'
import { FileList } from './FileList'
import { FilePreview } from './FilePreview'
import { Toolbar } from './Toolbar'
import { FileItem, FileManagerState } from './types'

function FileManager() {
  const [state, setState] = useState<FileManagerState>({
    currentPath: '/',
    selectedItems: [],
    viewMode: 'grid',
    files: [
      {
        id: '1',
        name: 'Documents',
        type: 'folder',
        lastModified: new Date(),
        path: '/Documents',
      },
      {
        id: '2',
        name: 'Images',
        type: 'folder',
        lastModified: new Date(),
        path: '/Images',
      },
      {
        id: '3',
        name: 'report.pdf',
        type: 'file',
        size: 1024 * 1024,
        lastModified: new Date(),
        path: '/report.pdf',
        content: '', // Base64 content would go here
      },
    ],
  })

  const [previewFile, setPreviewFile] = useState<FileItem | null>(null)

  const handleSelect = (id: string) => {
    setState((prev) => ({
      ...prev,
      selectedItems: prev.selectedItems.includes(id)
        ? prev.selectedItems.filter((item) => item !== id)
        : [...prev.selectedItems, id],
    }))
  }

  const handleOpen = (item: FileItem) => {
    if (item.type === 'folder') {
      setState((prev) => ({
        ...prev,
        currentPath: item.path,
        selectedItems: [],
      }))
    } else {
      setPreviewFile(item)
    }
  }

  const handleDelete = (ids: string[]) => {
    if (confirm('Are you sure you want to delete selected items?')) {
      setState((prev) => ({
        ...prev,
        files: prev.files.filter((file) => !ids.includes(file.id)),
        selectedItems: prev.selectedItems.filter((id) => !ids.includes(id)),
      }))
    }
  }

  const handleNavigate = (path: string) => {
    setState((prev) => ({
      ...prev,
      currentPath: path,
      selectedItems: [],
    }))
  }

  const handleUpload = async (files: File[]) => {
    const newFiles: FileItem[] = await Promise.all(
      files.map(async (file) => {
        const content = await readFileContent(file)
        return {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: 'file',
          size: file.size,
          lastModified: new Date(file.lastModified),
          path: `${state.currentPath}/${file.name}`,
          content,
          mimeType: file.type,
        }
      })
    )

    setState((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles],
    }))
  }

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject

      if (file.type.startsWith('text/')) {
        reader.readAsText(file)
      } else {
        reader.readAsDataURL(file)
      }
    })
  }

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setState((prev) => ({
      ...prev,
      viewMode: mode,
    }))
  }

  return (
    <div className='min-h-screen'>
      <div className='max-w-7xl mx-auto shadow-sm'>
        <Toolbar
          onNewFolder={() => {
            const name = prompt('Enter folder name:')
            if (name) {
              const newFolder: FileItem = {
                id: Date.now().toString(),
                name,
                type: 'folder',
                lastModified: new Date(),
                path: `${state.currentPath}/${name}`,
              }
              setState((prev) => ({
                ...prev,
                files: [...prev.files, newFolder],
              }))
            }
          }}
          onNewFile={() => alert('New file')}
          onDelete={() => handleDelete(state.selectedItems)}
          onUpload={handleUpload}
          onDownload={() => alert('Download')}
          viewMode={state.viewMode}
          onViewModeChange={handleViewModeChange}
          hasSelection={state.selectedItems.length > 0}
        />
        <CustomBreadcrumb
          path={state.currentPath}
          onNavigate={handleNavigate}
        />
        <FileList
          files={state.files.filter((file) => {
            if (state.currentPath === '/') {
              return file.path.split('/').length === 2
            }
            return file.path.startsWith(state.currentPath)
          })}
          selectedItems={state.selectedItems}
          viewMode={state.viewMode}
          onSelect={handleSelect}
          onOpen={handleOpen}
          onDelete={handleDelete}
        />
        <FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
      </div>
    </div>
  )
}

export default FileManager
