export interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: number
  lastModified: Date
  path: string
  content?: string
  mimeType?: string
}

export interface FileManagerState {
  currentPath: string
  selectedItems: string[]
  files: FileItem[]
  viewMode: 'grid' | 'list'
  isLoading: boolean
}

export type ViewMode = 'grid' | 'list'
