import { useEffect } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import trainingApi from '@/apis/training'
import { toast } from 'sonner'
import { usePathStore } from '@/stores/pathStore'
import { useUUIDStore } from '@/stores/uuidStore'
import { getSessionMessage } from '@/lib/utils'
import { useSession } from '@/hooks/use-session'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  output_dir: z.string().nonempty('输出文件夹路径不能为空'),
})

type Session = {
  task_name: string
  status: string
  error: string | null
  pid: number
  result: Record<string, unknown>
}

type StatusResponse = {
  current_session: Session
  last_session: Partial<Session>
}

function NormalizationForm() {
  const normalize = usePathStore((state) => state.normalize)
  const session = useSession()
  const uuid = useUUIDStore((state) => state.normalize)
  const setUUID = useUUIDStore((state) => state.setUUID)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      output_dir: normalize.outputDir,
    },
  })

  useEffect(() => {
    const { outputDir } = normalize
    if (outputDir) {
      form.setValue('output_dir', outputDir)
    }
  }, [normalize, form])

  const startMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await trainingApi.startNormalization(data)
      return res.data
    },
    onSuccess: (data) => {
      toast.success('音频归一化已启动')
      setUUID('normalize', data.uuid)
      session.refetch()
    },
  })

  // const stopMutation = useMutation({
  //   mutationFn: async () => {
  //     return toast.promise(trainingApi.stopNormalize(), {
  //       loading: '正在停止音频归一化...',
  //       success: '已停止音频归一化',
  //       error: '停止失败，请重试',
  //     })
  //   },
  //   onSuccess: () => {},
  // })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await startMutation.mutateAsync(values)
  }

  async function onStop() {
    await stopMutation.mutateAsync()
  }

  const message = getSessionMessage(uuid, session.data)
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 w-full'>
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-12'>
            <FormField
              control={form.control}
              name='output_dir'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>输出文件夹路径</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='输出文件夹路径'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='col-span-12 flex gap-4'>
            <Button type='submit' className='w-full h-full'>
              开始归一化
            </Button>
            <Textarea
              placeholder='输出信息'
              rows={3}
              readOnly
              className='w-full'
              value={message}
            />
          </div>
        </div>
      </form>
    </Form>
  )
}

export default function Normalization() {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>2a. 音频归一化</CardTitle>
      </CardHeader>
      <CardContent>
        <NormalizationForm />
      </CardContent>
    </Card>
  )
}
