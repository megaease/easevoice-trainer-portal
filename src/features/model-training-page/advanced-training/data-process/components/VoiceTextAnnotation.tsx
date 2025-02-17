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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import AudioTextListEditor from './AudioTextListEditor'

const formSchema = z.object({
  input_dir: z.string().nonempty('输入文件夹路径不能为空'),
})

function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const statusQuery = useQuery({
    queryKey: ['VoiceTextAnnotation', 'status'],
    queryFn: async () => {
      const response = await trainingApi.getVoiceExtractionStatus()
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
      return toast.promise(
        () =>
          trainingApi.getRefinementList({
            input_dir: data.input_dir,
            output_dir: data.input_dir,
          }),
        {
          loading: '正在启动...',
          success: '获取打标列表',
          error: '启动失败，请重试',
        }
      )
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
        <FormField
          control={form.control}
          name='input_dir'
          render={({ field }) => (
            <FormItem>
              <FormLabel>.list标注文件的路径</FormLabel>
              <FormControl>
                <Input
                  placeholder='请输入.list标注文件的路径'
                  type='text'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='grid grid-cols-2 gap-4'>
          <Button type='submit' className='h-full'>
            开始标注
          </Button>
          <Textarea
            placeholder='输出信息'
            readOnly
            value={statusQuery.data?.last_session?.output}
          />
        </div>
      </form>
    </Form>
  )
}

export default function VoiceTextAnnotation() {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>5. 语音文本校对标注工具</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <MyForm />
      </CardContent>
    </Card>
  )
}
