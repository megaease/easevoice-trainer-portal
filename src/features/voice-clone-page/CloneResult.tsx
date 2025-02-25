import { useQueryClient, useMutation } from '@tanstack/react-query'
import fileApi, { RequestBody } from '@/apis/files'
import { Download, CloudUpload, Bird } from 'lucide-react'
import { toast } from 'sonner'
import { useNamespaceStore } from '@/stores/namespaceStore'
import { getAudio, getSessionMessage } from '@/lib/utils'
import { useSession } from '@/hooks/use-session'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import AudioPlayer from '@/components/audio-player'

export function CloneResult({ uuid }: { uuid: string }) {
  const session = useSession()
  const { currentNamespace } = useNamespaceStore()
  const path = currentNamespace?.homePath + '/outputs'

  const queryClient = useQueryClient()
  const uploadMutation = useMutation({
    mutationFn: (data: RequestBody) => {
      return fileApi.uploadFiles(data)
    },
    onMutate: () => {
      return toast.loading('正在保存', {
        id: 'upload-toast',
        description: '请稍等',
      })
    },
    onSuccess: () => {
      toast.success('文件已保存到：' + path, {
        id: 'upload-toast',
        description: '请到文件管理器中查看',
      })
      queryClient.invalidateQueries(
        {
          queryKey: ['files', path],
          exact: true,
          refetchType: 'active',
        },
        { throwOnError: true, cancelRefetch: true }
      )
    },
    onError: (error) => {
      toast.error('保存失败: 请新建outputs文件夹后重试', {
        id: 'upload-toast',
        description: (error as any)?.response.data.detail,
      })
    },
  })
  const result = getAudio(uuid, session.data)
  const message = getSessionMessage(uuid, session.data)
  return (
    <section className='space-y-8 max-w-3xl mx-auto h-full p-4 '>
      <Card className=''>
        <CardHeader>
          <CardTitle>合成结果 </CardTitle>
          <CardDescription>合成的音频会自动保存到：{path}。</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4 '>
          {message && (
            <div className='text-center text-gray-500 flex flex-col items-center gap-4 text-sm'>
              <Bird className='inline-block w-10 h-10' />
              {message}
            </div>
          )}
          {result ? (
            <div className=''>
              <div className='flex items-center gap-4'>
                <p className='text-sm font-semibold'>{result.name}</p>
              </div>
              <div className='flex justify-end gap-4'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = result.url || ''
                        link.download = result.name
                        link.click()
                      }}
                      size={'icon'}
                      variant={'outline'}
                    >
                      <Download />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className='text-secondary-foreground bg-secondary border'>
                    <p>下载到本地</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={async () => {
                        const response = await fetch(result.url || '')
                        const blob = await response.blob()
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          const base64data = (reader.result as string).split(
                            ','
                          )[1]

                          uploadMutation.mutate({
                            directoryPath: path,
                            fileName: result.name,
                            fileContent: base64data,
                          })
                        }
                        reader.readAsDataURL(blob)
                      }}
                      size={'icon'}
                      variant={'outline'}
                    >
                      <CloudUpload />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className='text-secondary-foreground bg-secondary border'>
                    <p>保存到云端</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <AudioPlayer audioState={result} />
            </div>
          ) : (
            <div className='text-center text-gray-500 flex flex-col items-center gap-4 text-sm'>
              <Bird className='inline-block w-10 h-10' />
              暂无合成结果
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
