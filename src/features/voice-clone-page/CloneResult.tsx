import { useEffect, useState } from 'react'
import { Download, Bird } from 'lucide-react'
import { useNamespaceStore } from '@/stores/namespaceStore'
import { getAudioPath, getSessionMessage } from '@/lib/utils'
import { getAudioDuration } from '@/utils/audio'
import { useFileDownloadMutation } from '@/hooks/use-file-download'
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
  const audioPath = getAudioPath(uuid, session.data)
  const message = getSessionMessage(uuid, session.data)
  const audioName = audioPath?.split('/').pop() || ''

  const [audioState, setAudioState] = useState({
    url: '',
    duration: '',
    name: audioName,
  })

  const fileDownloadMutation = useFileDownloadMutation()

  useEffect(() => {
    let mounted = true

    const loadAudio = async () => {
      if (!audioPath) return

      try {
        const url = await fileDownloadMutation.mutateAsync(audioPath)
        if (!url || !mounted) return

        const duration = await getAudioDuration(url)
        setAudioState({ url, duration, name: audioName })
      } catch (error) {
        console.error('Error loading audio:', error)
      }
    }

    loadAudio()

    return () => {
      mounted = false
      if (audioState.url) {
        URL.revokeObjectURL(audioState.url)
      }
    }
  }, [audioPath, audioName])

  const handleDownload = () => {
    if (!audioState.url) return

    const link = document.createElement('a')
    link.href = audioState.url
    link.download = audioName
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const renderContent = () => {
    if (!audioPath || !audioState.url) {
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
                disabled={!audioState.url || fileDownloadMutation.isPending}
              >
                {fileDownloadMutation.isPending ? (
                  <span className='animate-spin'>⏳</span>
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
        <AudioPlayer audioState={audioState} />
      </div>
    )
  }

  return (
    <section className='space-y-8 max-w-3xl mx-auto h-full p-4'>
      <Card>
        <CardHeader>
          <CardTitle className='flex justify-between gap-2'>
            合成结果
            {audioState?.url && message ? (
              <p className='text-sm text-muted-foreground font-normal'>
                {message}
              </p>
            ) : null}
          </CardTitle>
          <CardDescription>合成的音频会自动保存到：{path}。</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>{renderContent()}</CardContent>
      </Card>
    </section>
  )
}
