import { useMutation, useQueryClient } from '@tanstack/react-query'
import fileApi, { RequestBody } from '@/apis/files'
import { toast } from 'sonner'

export function useAudioUpload(currentPath: string) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: RequestBody) => {
      return fileApi.uploadFiles(data)
    },
    onMutate: () => {
      return toast.loading('上传中', { id: 'upload-toast' })
    },
    onSuccess: () => {
      toast.success('上传成功', { id: 'upload-toast' })
    },
    onError: () => {
      toast.error('上传失败', { id: 'upload-toast' })
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['files', currentPath],
        exact: true,
        refetchType: 'active',
      })
    },
  })
}