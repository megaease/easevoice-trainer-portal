'use client'

import { useEffect } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import trainingApi from '@/apis/training'
import { toast } from 'sonner'
import { useNamespaceStore } from '@/stores/namespaceStore'
import { useTrainInputDirStore } from '@/stores/trainInputDirStore'
import { useUUIDStore } from '@/stores/uuidStore'
import { isTaskRunning, getRequest, getSessionMessage } from '@/lib/utils'
import { useSession } from '@/hooks/use-session'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingButton } from '@/components/ui/loading-button'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  source_dir: z.string().nonempty('音频文件夹路径不能为空'),
  output_dir: z.string().nonempty('输出文件夹路径不能为空'),
})
const defaultValues = {
  source_dir: '',
  output_dir: '',
}
function MyForm() {
  const session = useSession()
  const uuid = useUUIDStore((state) => state.denoise)
  const setUUID = useUUIDStore((state) => state.setUUID)

  const request = getRequest(uuid, session.data) as z.infer<
    typeof formSchema
  > | null

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })
  const { getTrainingAudiosPath, getTrainingOutputPath } = useNamespaceStore()
  const sourcePath = getTrainingAudiosPath()
  const outputPath = getTrainingOutputPath()

  useEffect(() => {
    if (sourcePath) {
      form.setValue('source_dir', sourcePath, { shouldValidate: true })
    }
    if (outputPath) {
      form.setValue('output_dir', outputPath, { shouldValidate: true })
    }
  }, [form, sourcePath, outputPath])
  useEffect(() => {
    if (request) {
      form.reset(request)
    }
  }, [request, form])

  const startMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await trainingApi.startAudioDenoising(data)
      return res.data
    },
    onSuccess: (data) => {
      toast.success('开始语音降噪')
      setUUID('denoise', data.uuid)
      session.refetch()
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await startMutation.mutateAsync(values)
  }

  const message = getSessionMessage(uuid, session.data)
  const isTaskRunningValue = isTaskRunning(uuid, session.data)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 w-full'>
        <div>
          <FormField
            control={form.control}
            name='source_dir'
            render={({ field }) => (
              <FormItem>
                <FormLabel>降噪音频文件输入文件夹</FormLabel>
                <FormControl>
                  <Input
                    placeholder='音频文件夹路径'
                    type='text'
                    readOnly
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name='output_dir'
            render={({ field }) => (
              <FormItem>
                <FormLabel>降噪结果输出文件夹</FormLabel>
                <FormControl>
                  <Input
                    placeholder='输出文件夹路径'
                    type='text'
                    readOnly
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2 h-full'>
            <LoadingButton
              type='submit'
              className='w-full h-full'
              loading={isTaskRunningValue}
            >
              开始语音降噪
            </LoadingButton>
          </div>
          <Textarea
            placeholder='输出信息'
            rows={3}
            readOnly
            className='w-full'
            value={message}
          />
        </div>
      </form>
    </Form>
  )
}

export default function AudioDenoising() {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>1c. 语音降噪工具</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <MyForm />
      </CardContent>
    </Card>
  )
}
