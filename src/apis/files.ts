import apiClient from '@/lib/apiClient'

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
  async downloadFile(filePath: string) {
    return await apiClient({
      method: 'GET',
      url: `/files`,
      params: { filePath },
      responseType: 'blob',
    })
  }
}

export default new FileApi()
