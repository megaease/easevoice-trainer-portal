import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import fileApi, { RequestBody } from '@/apis/files'
import sessionApi from '@/apis/session'
import { toast } from 'sonner'
import { useNamespaceStore } from '@/stores/namespaceStore'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import AudioPlayer from '@/components/audio-player'
import { AudioState } from '@/components/audio-record-player/type'

export function CloneResult({ result }: { result: AudioState | null }) {
  const { currentNamespace } = useNamespaceStore()
  const path = currentNamespace?.homePath + '/outputs' || '/'
  const query = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      return sessionApi.getSessionInfo()
    },
  })
  const uploadMutation = useMutation({
    mutationFn: (data: RequestBody) => {
      return fileApi.uploadFiles(data)
    },
    onMutate: () => {
      return toast.loading('正在保存', {
        id: 'upload-toast',
      })
    },
    onSuccess: () => {
      toast.success('文件已保存到：' + path, {
        id: 'upload-toast',
      })
    },
    onError: () => {
      toast.error('保存失败', {
        id: 'upload-toast',
      })
    },
  })
  console.log(result)
  if (!result || !result.url) return null
  return (
    <section className='space-y-8 max-w-3xl mx-auto h-full p-4 '>
      <Card className='border-none shadow-none'>
        <CardHeader>
          <CardTitle>合成结果</CardTitle>
        </CardHeader>
        <CardContent>
          <AudioPlayer audioState={result} />
          <div className='flex justify-between mt-4'>
            <Button
              onClick={() => {
                const link = document.createElement('a')
                link.href = result.url || ''
                link.download = result.name
                link.click()
              }}
            >
              下载到本地
            </Button>
            <Button
              onClick={async () => {
                const response = await fetch(result.url || '')
                const blob = await response.blob()
                const reader = new FileReader()
                reader.onloadend = () => {
                  const base64data = (reader.result as string).split(',')[1]

                  uploadMutation.mutate({
                    directoryPath: path,
                    fileName: result.name,
                    fileContent: base64data,
                  })
                }
                reader.readAsDataURL(blob)
              }}
            >
              保存到云端
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
