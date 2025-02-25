export interface FileItem {
  fileName: string
  fileSize: number
  modifiedAt: string
  type: 'file'
}

export interface FolderItem {
  directoryName: string
  type: 'directory'
}

export interface FileListType {
  files: FileItem[]
  directoryPath: string
  directories: FolderItem[]
}

export type ViewMode = 'grid' | 'list'
