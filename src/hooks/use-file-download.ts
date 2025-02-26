import { useMutation } from '@tanstack/react-query'
import fileApi from '@/apis/files'
import { toast } from 'sonner'

export function useFileDownloadMutation() {
  return useMutation({
    mutationFn: async (filePath: string) => {
      const response = await fileApi.downloadFile(filePath)
      const blob = await response.data
      const url = window.URL.createObjectURL(blob)
      return url
    },
    onError: () => {},
  })
}
