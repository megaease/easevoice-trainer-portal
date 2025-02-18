import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import trainingApi from '@/apis/training'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
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
  batch_size: z.number().min(1, '批量大小必须大于0'),
  total_epochs: z.number().min(1, '总Epoch数必须大于0'),
  text_low_lr_rate: z.number(),
  pretrained_s2G: z.string().nonempty('请输入Pretrained S2G路径'),
  pretrained_s2D: z.string().nonempty('请输入Pretrained S2D路径'),
  if_save_latest: z.boolean(),
  if_save_every_weights: z.boolean(),
  save_every_epoch: z.number().min(1, '保存频率必须大于0'),
  gpu_ids: z.string().nonempty('请输入GPU IDs'),
  train_input_dir: z.string().nonempty('请输入训练输入目录'),
  output_model_name: z.string().nonempty('请输入输出模型名'),
})

function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batch_size: 1,
      total_epochs: 1,
      text_low_lr_rate: 0.0,
      pretrained_s2G: '',
      pretrained_s2D: '',
      if_save_latest: false,
      if_save_every_weights: false,
      save_every_epoch: 1,
      gpu_ids: '',
      train_input_dir: '',
      output_model_name: 'sovits',
    },
  })

  const statusQuery = useQuery<StatusResponse>({
    queryKey: ['SovitsTraining', 'status'],
    queryFn: async () => {
      const response = await trainingApi.getSovitsTrainingStatus()
      return response.data
    },
    refetchInterval: (data) => {
      return data?.current_session?.status === 'Running' ? 5000 : false
    },
    refetchIntervalInBackground: false,
  })

  const startMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return toast.promise(trainingApi.startSovitsTraining(data), {
        loading: '正在启动 So-VITS 训练...',
        success: '开始 So-VITS 训练',
        error: '启动失败，请重试',
      })
    },
    onSuccess: () => {
      statusQuery.refetch()
    },
  })

  const stopMutation = useMutation({
    mutationFn: async () => {
      return toast.promise(trainingApi.stopSovitsTraining(), {
        loading: '正在停止 So-VITS 训练...',
        success: '已停止 So-VITS 训练',
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

  const outputMessage = statusQuery.data?.last_session?.result?.status + ''

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          <FormField
            control={form.control}
            name='output_model_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>模型名称</FormLabel>
                <FormControl>
                  <Input placeholder='请输入模型名称' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='batch_size'
            render={({ field }) => (
              <FormItem>
                <FormLabel>每张显卡的batch_size</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='请输入每张显卡的batch_size'
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='total_epochs'
            render={({ field }) => (
              <FormItem>
                <FormLabel>总训练轮数total_epoch</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='请输入总训练轮数total_epoch'
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='text_low_lr_rate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>文本模块学习率权重</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    step='0.01'
                    placeholder='请输入文本模块学习率权重'
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='pretrained_s2G'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pretrained S2G</FormLabel>
                <FormControl>
                  <Input placeholder='请输入Pretrained S2G路径' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='pretrained_s2D'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pretrained S2D</FormLabel>
                <FormControl>
                  <Input placeholder='请输入Pretrained S2D路径' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='save_every_epoch'
            render={({ field }) => (
              <FormItem>
                <FormLabel>保存每次Epoch</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='请输入每次保存的Epoch数'
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='train_input_dir'
            render={({ field }) => (
              <FormItem>
                <FormLabel>训练输入目录</FormLabel>
                <FormControl>
                  <Input placeholder='请输入训练输入目录' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='space-y-2'>
          <FormField
            control={form.control}
            name='if_save_latest'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>是否仅保存最新的ckpt文件以节省硬盘空间</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='if_save_every_weights'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>
                    是否在每次保存时间点将最终小模型保存至weights文件夹
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className='grid gap-4 grid-cols-2'>
          {statusQuery.data?.current_session?.status === 'Running' ? (
            <Button
              type='button'
              onClick={onStop}
              variant='destructive'
              className='h-full'
            >
              停止训练
            </Button>
          ) : (
            <Button type='submit' className='h-full'>
              开始训练
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
      </form>
    </Form>
  )
}

export default function SovitsTraining() {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>2b. So-VITS 模型训练</CardTitle>
        <CardDescription>配置并管理 So-VITS 模型训练参数</CardDescription>
      </CardHeader>
      <CardContent>
        <MyForm />
      </CardContent>
    </Card>
  )
}
