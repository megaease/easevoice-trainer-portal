import { useMutation } from '@tanstack/react-query'
import fileApi from '@/apis/files'
import { toast } from 'sonner'

export function useFileDownload() {
  return useMutation({
    mutationFn: async ({ filePath, fileName }: { filePath: string; fileName: string }) => {
      const response = await fileApi.downloadFile(filePath)
      const blob = await response.data
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    },
    onError: (error) => {
      toast.error('下载失败')
      console.error('Download error:', error)
    }
  })
}