import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import trainingApi from '@/apis/training'
import { toast } from 'sonner'
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      output_dir: '',
    },
  })

  const statusQuery = useQuery<StatusResponse>({
    queryKey: ['Normalize', 'status'],
    queryFn: async () => {
      const response = await trainingApi.getNormalizationStatus()
      return response.data
    },
    refetchInterval: (data) => {
      return data.state.data?.current_session?.status === 'Running'
        ? 5000
        : false
    },
    refetchIntervalInBackground: false,
  })

  const startMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return toast.promise(trainingApi.startNormalize(data), {
        loading: '正在启动音频归一化...',
        success: '开始音频归一化',
        error: '启动失败，请重试',
      })
    },
    onSuccess: () => {
      statusQuery.refetch()
    },
  })

  const stopMutation = useMutation({
    mutationFn: async () => {
      return toast.promise(trainingApi.stopNormalize(), {
        loading: '正在停止音频归一化...',
        success: '已停止音频归一化',
        error: '停止失败，请重试',
      })
    },
    onSuccess: () => {
      statusQuery.refetch()
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await startMutation.mutateAsync(values)
  }

  async function onStop() {
    await stopMutation.mutateAsync()
  }

  const outputMessage = statusQuery.data?.last_session?.result?.status

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
            {statusQuery.data?.current_session?.status === 'Running' ? (
              <Button type='button' onClick={onStop} className='w-full h-full'>
                停止归一化
              </Button>
            ) : (
              <Button type='submit' className='w-full h-full'>
                开始归一化
              </Button>
            )}
            <Textarea
              placeholder='输出信息'
              rows={3}
              value={outputMessage}
              readOnly
              className='w-full'
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
