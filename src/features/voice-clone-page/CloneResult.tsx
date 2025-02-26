import { useQueryClient, useMutation } from '@tanstack/react-query'
import fileApi, { RequestBody } from '@/apis/files'
import { Download, CloudUpload, Bird } from 'lucide-react'
import { toast } from 'sonner'
import { useNamespaceStore } from '@/stores/namespaceStore'
import { getAudioPath, getSessionMessage } from '@/lib/utils'
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
import AudioPlayerWithFetchData from '../model-training-page/advanced-training/data-process/components/AudioPlayerWithFetchData'
import { useFileDownload } from '@/hooks/use-file-download'

export function CloneResult({ uuid }: { uuid: string }) {
  const session = useSession()
  const { currentNamespace } = useNamespaceStore()
  const path = currentNamespace?.homePath + '/outputs'
  const audioPath = getAudioPath(uuid, session.data)
  const message = getSessionMessage(uuid, session.data)
  const audioName = audioPath?.split('/').pop() || ''
  
  const downloadFile = useFileDownload()

  const handleDownload = () => {
    if (!audioPath) return
    downloadFile.mutate({ filePath: audioPath, fileName: audioName })
  }

  const renderContent = () => {
    if (!audioPath) {
      return (
        <div className='text-center text-gray-500 flex flex-col items-center gap-4 text-sm'>
          <Bird className='inline-block w-10 h-10' />
          暂无合成结果
        </div>
      )
    }

    return (
      <div>
        <div className='flex items-center gap-4'>
          <p className='text-sm font-semibold'>{audioName}</p>
        </div>
        <div className='flex justify-end gap-4'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleDownload}
                size={'icon'}
                variant={'outline'}
                disabled={downloadFile.isPending}
              >
                {downloadFile.isPending ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <Download />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className='text-secondary-foreground bg-secondary border'>
              <p>下载到本地</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <AudioPlayerWithFetchData filePath={audioPath} name={audioName} />
      </div>
    )
  }

  return (
    <section className='space-y-8 max-w-3xl mx-auto h-full p-4'>
      <Card>
        <CardHeader>
          <CardTitle className='flex justify-between gap-2'>
            合成结果
            <p className='text-sm text-muted-foreground font-normal'>{message}</p>
          </CardTitle>
          <CardDescription>合成的音频会自动保存到：{path}。</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {renderContent()}
        </CardContent>
      </Card>
    </section>
  )
}
