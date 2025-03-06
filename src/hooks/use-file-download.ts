import { useMutation } from '@tanstack/react-query'
import fileApi from '@/apis/files'

export function useFileDownloadMutation() {
  return useMutation({
    mutationFn: async (filePath: string) => {
      const response = await fileApi.downloadFile(filePath)
      const blob = await response.data
      return blob
    },
    onError: () => {},
  })
}
