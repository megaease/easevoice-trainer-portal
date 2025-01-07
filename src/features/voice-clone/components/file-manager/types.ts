export interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: number
  lastModified: Date
  path: string
  content?: string // Base64 encoded content for preview
  mimeType?: string
}

export interface FileManagerState {
  currentPath: string
  selectedItems: string[]
  files: FileItem[]
  viewMode: 'grid' | 'list'
}

export type ViewMode = 'grid' | 'list'
