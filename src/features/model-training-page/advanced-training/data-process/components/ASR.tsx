import React from 'react'
import { useState } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import trainingApi from '@/apis/training'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

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

const formSchema = z.object({
  source_dir: z.string(),
  output_dir: z.string(),
  asr_model: z.string(),
  model_size: z.string(),
  language: z.string(),
  precision: z.string(),
})

function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source_dir: '',
      output_dir: '',
      asr_model: 'funasr',
      model_size: 'large',
      language: 'zh',
      precision: 'float32',
    },
  })

  const statusQuery = useQuery<StatusResponse>({
    queryKey: ['ASR', 'status'],
    queryFn: async () => {
      const response = await trainingApi.getAudioTranscriptionStatus()
      return response.data
    },
    refetchInterval: (data) => {
      return data.state.data?.current_session?.status === 'running'
        ? 5000
        : false
    },
    refetchIntervalInBackground: false,
  })

  const startMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return toast.promise(trainingApi.startAudioTranscription(data), {
        loading: '正在启动音频转文字...',
        success: '音频转文字已启动',
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
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-6'>
            <FormField
              control={form.control}
              name='source_dir'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>输入文件夹路径</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='输入文件夹路径'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='col-span-6'>
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
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-3'>
            <FormField
              control={form.control}
              name='asr_model'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ASR 模型</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='请选择 ASR 模型' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='funasr'>funasr</SelectItem>
                      <SelectItem value='other_model'>other_model</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='col-span-3'>
            <FormField
              control={form.control}
              name='model_size'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ASR 模型尺寸</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='请选择模型尺寸' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='large'>large</SelectItem>
                      <SelectItem value='small'>small</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='col-span-3'>
            <FormField
              control={form.control}
              name='language'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ASR 语言设置</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='请选择语言' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='zh'>中文</SelectItem>
                      <SelectItem value='en'>英文</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='col-span-3'>
            <FormField
              control={form.control}
              name='precision'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>数据类型精度</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='请选择精度' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='float32'>float32</SelectItem>
                      <SelectItem value='float16'>float16</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <Button type='submit' className='h-full'>
            开始语音切割
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

export default function ASR() {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>4. 音频转文字</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <MyForm />
      </CardContent>
    </Card>
  )
}
