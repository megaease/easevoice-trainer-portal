export interface FileItem {
  fileName: string;       
  fileSize: number;       
  modifiedAt: string;     
  type: 'file';   
}

export interface FolderItem { 
  directoryName: string;         
  type:  "directory",
}

export interface FileManagerState {
  currentPath: string
  selectedItems: string[]
  files: FileItem[]
  viewMode: 'grid' | 'list'
  isLoading: boolean
}

export type ViewMode = 'grid' | 'list'
