'use client'

import { useEffect, useState } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import trainingApi from '@/apis/training'
import { toast } from 'sonner'
import { usePathStore } from '@/stores/pathStore'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
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
  const sourceDir: string = usePathStore((state) => state.sourceDir)
  const outputDir: string = usePathStore((state) => state.outputDir)

  useEffect(() => {
    form.setValue('source_dir', sourceDir)
  }, [sourceDir, form])

  useEffect(() => {
    form.setValue('output_dir', outputDir)
  }, [outputDir, form])

  const statusQuery = useQuery({
    queryKey: ['AudioDenoising', 'status'],
    queryFn: async () => {
      const response = await trainingApi.getAudioDenoisingStatus()
      return response.data
    },
    refetchInterval: (data) => {
      return data.state.data?.current_session ? 5000 : false
    },
    refetchIntervalInBackground: false,
  })

  const startMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return toast.promise(trainingApi.startAudioDenoising(data), {
        loading: '正在启动语音降噪...',
        success: '开始语音降噪',
        error: '启动失败，请重试',
      })
    },
    onSuccess: () => {
      statusQuery.refetch()
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await startMutation.mutateAsync(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
          <Button type='submit' className='h-full'>
            开始语音降噪
          </Button>
          <Textarea
            placeholder='输出信息'
            rows={3}
            value={statusQuery.data?.last_session?.output}
            readOnly
            className='w-full'
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
