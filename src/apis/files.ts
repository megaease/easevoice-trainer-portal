import apiClient from '@/lib/apiClient'

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
export type RequestBody = {
  directoryPath: string
  fileName: string
  fileContent: string
}
class FileApi {
  async createFolder(directoryPath: string) {
    return await apiClient.post('/directories', { directoryPath })
  }

  async getFolderContents(directoryPath: string) {
    return await apiClient({
      method: 'GET',
      url: `/directories`,
      params: { directoryPath },
    })
  }

  async uploadFiles(data: RequestBody) {
    return await apiClient.post(`/files`, data)
  }

  async deleteFileAndFolders(directoryPath: string[]) {
    return await apiClient({
      method: 'POST',
      url: `/delete-dirs-files`,
      data: {
        paths: directoryPath,
      },
    })
  }
}

export default new FileApi()
