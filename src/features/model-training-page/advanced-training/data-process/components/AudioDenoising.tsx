'use client'

import { useEffect } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import trainingApi from '@/apis/training'
import { toast } from 'sonner'
import { usePathStore } from '@/stores/pathStore'
import { useUUIDStore } from '@/stores/uuidStore'
import { getDisabledSubmit, getSessionMessage } from '@/lib/utils'
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
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  source_dir: z.string().nonempty('音频文件夹路径不能为空'),
  output_dir: z.string().nonempty('输出文件夹路径不能为空'),
})

function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source_dir: '',
      output_dir: '',
    },
  })
  const session = useSession()
  const uuid = useUUIDStore((state) => state.denoise)
  const setUUID = useUUIDStore((state) => state.setUUID)
  const denoise = usePathStore((state) => state.denoise)
  const setPaths = usePathStore((state) => state.setPaths)
  const startMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await trainingApi.startAudioDenoising(data)
      return res.data
    },
    onSuccess: (data) => {
      toast.success('开始语音降噪')
      setUUID('denoise', data.uuid)
      session.refetch()
      setPaths('asr', {
        sourceDir: form.getValues('source_dir'),
        outputDir: form.getValues('output_dir'),
      })
    },
  })
  useEffect(() => {
    const { sourceDir } = denoise
    form.setValue('source_dir', sourceDir)
    form.setValue('output_dir', `${sourceDir}/output`)
  }, [denoise, form])
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'source_dir' && value.source_dir) {
        form.setValue('output_dir', `${value.source_dir}/output`)
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await startMutation.mutateAsync(values)
  }

  const message = getSessionMessage(uuid, session.data)
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
                  <Input placeholder='音频文件夹路径' type='text' {...field} />
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
                  <Input placeholder='输出文件夹路径' type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <Button
            type='submit'
            className='h-full'
            disabled={getDisabledSubmit(uuid, session.data)}
          >
            开始语音降噪
          </Button>
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
