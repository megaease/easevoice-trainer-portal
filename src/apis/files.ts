import apiClient from "@/lib/apiClient"

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

// 模拟 API 延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 模拟文件系统数据
const fileSystem = new Map<string, FileItem[]>([
  [
    '/',
    [
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
    ],
  ],
  [
    '/Documents',
    [
      {
        id: '3',
        name: 'Work',
        type: 'folder',
        lastModified: new Date(),
        path: '/Documents/Work',
      },
      {
        id: '4',
        name: 'notes.txt',
        type: 'file',
        size: 1024,
        lastModified: new Date(),
        path: '/Documents/notes.txt',
        content: 'Hello World',
        mimeType: 'text/plain',
      },
    ],
  ],
  [
    '/Documents/Work',
    [
      {
        id: '6',
        name: 'Project',
        type: 'folder',
        lastModified: new Date(),
        path: '/Documents/Work/Project',
      },
    ],
  ],
  [
    '/Documents/Work/Project',
    [
      {
        id: '7',
        name: 'report.docx',
        type: 'file',
        size: 2048,
        lastModified: new Date(),
        path: '/Documents/Work/Project/report.docx',
        content: 'Project Report Content',
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
      {
        id: '9',
        name: 'dev',
        type: 'folder',
        lastModified: new Date(),
        path: '/Documents/Work/Project/dev',
      },
    ],
  ],
  [
    '/Documents/Work/Project/dev',
    [
      {
        id: '10',
        name: 'main.js',
        type: 'file',
        size: 3072,
        lastModified: new Date(),
      },
    ],
  ],
  [
    '/Images',
    [
      {
        id: '5',
        name: 'Vacation',
        type: 'folder',
        lastModified: new Date(),
        path: '/Images/Vacation',
      },
    ],
  ],
  [
    '/Images/Vacation',
    [
      {
        id: '8',
        name: 'Beach.png',
        type: 'file',
        size: 4096,
        lastModified: new Date(),
        path: '/Images/Vacation/Beach.png',
        content: 'Base64EncodedImageContent',
        mimeType: 'image/png',
      },
    ],
  ],
])

export async function fetchFolderContents(path: string): Promise<FileItem[]> {
  await delay(300) // 模拟网络延迟

  const files = fileSystem.get(path)
  if (!files) {
    return []
  }

  return files
}

export async function uploadFiles(
  path: string,
  files: File[]
): Promise<FileItem[]> {
  await delay(300) // 模拟上传延迟

  const newFiles: FileItem[] = await Promise.all(
    files.map(async (file) => {
      const content = await readFileContent(file)
      return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: 'file',
        size: file.size,
        lastModified: new Date(file.lastModified),
        path: `${path}/${file.name}`,
        content,
        mimeType: file.type,
      }
    })
  )

  // 更新模拟文件系统
  const currentFiles = fileSystem.get(path) || []
  fileSystem.set(path, [...currentFiles, ...newFiles])

  return newFiles
}

export async function deleteFiles(path: string, ids: string[]): Promise<void> {
  await delay(500) // 模拟删除延迟

  const currentFiles = fileSystem.get(path) || []
  const updatedFiles = currentFiles.filter((file) => !ids.includes(file.id))
  fileSystem.set(path, updatedFiles)
}

function readFileContent(file: File): Promise<string> {
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


class FileApi {
  async createFolder(directoryPath:string) { 
    return await apiClient.post("/directories", { directoryPath });
  }

  async deleteFolder(directoryPath:string) { 
    return await apiClient.delete("/directories", );
  }

  async getFolderContents(directoryPath: string) { 
    return await apiClient({
      method: 'GET',
      url: `/directories`,
      params: { directoryPath }
    });
  }

  async uploadFiles(directoryPath: string, files: File[]) { 
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    return await apiClient.post(`/files/upload/${directoryPath}`, formData);
  }

  async deleteFiles(directoryPath: string, fileIds: string[]) { 
    return await apiClient.delete(`/files/${directoryPath}`, { data: { fileIds } });
  }
}

export default new FileApi();