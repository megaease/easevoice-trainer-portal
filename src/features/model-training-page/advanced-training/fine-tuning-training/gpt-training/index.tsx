import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
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
import { FormDescription } from '@/components/ui/form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
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
  output_model_name: z.string().nonempty('模型名称不能为空'),
  model_path: z.string().nonempty('预训练模型路径不能为空'),
  batch_size: z.number().min(1, 'Batch size must be at least 1'),
  total_epochs: z.number().min(1, 'Total epochs must be at least 1'),
  save_every_epoch: z.number().min(1, 'Save every epoch must be at least 1'),
  if_dpo: z.boolean(),
  if_save_latest: z.boolean(),
  if_save_every_weights: z.boolean(),
  gpu_ids: z.string().nonempty('GPU IDs不能为空'),
  train_input_dir: z.string().nonempty('训练输入目录不能为空'),
  normalize_path: z.string().nonempty('标准化路径不能为空'),
})

function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      output_model_name: 'gpt',
      model_path: '',
      batch_size: 8,
      total_epochs: 15,
      save_every_epoch: 5,
      if_dpo: false,
      if_save_latest: true,
      if_save_every_weights: true,
      gpu_ids: '0',
      train_input_dir: '',
      normalize_path: '',
    },
  })

  const startMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return toast.promise(trainingApi.startGPTTraining(data), {
        loading: '正在启动 GPT 训练...',
        success: '开始 GPT 训练',
        error: '启动失败，请重试',
      })
    },
    onSuccess: () => {},
  })

  const stopMutation = useMutation({
    mutationFn: async () => {
      return toast.promise(trainingApi.stopGPTTraining(), {
        loading: '正在停止 GPT 训练...',
        success: '已停止 GPT 训练',
        error: '停止失败，请重试',
      })
    },
    onSuccess: () => {},
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await startMutation.mutateAsync(values)
  }

  async function onStop() {
    await stopMutation.mutateAsync()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-2 gap-4'>
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
            name='model_path'
            render={({ field }) => (
              <FormItem>
                <FormLabel>预训练模型路径</FormLabel>
                <FormControl>
                  <Input placeholder='请输入预训练模型路径' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='train_input_dir'
            render={({ field }) => (
              <FormItem>
                <FormLabel>训练输入目录</FormLabel>
                <FormControl>
                  <Input placeholder='与音频处理保持一致' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='normalize_path'
            render={({ field }) => (
              <FormItem>
                <FormLabel>标准化路径</FormLabel>
                <FormControl>
                  <Input placeholder='一键三联的输出结果中获取' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='grid grid-cols-3 gap-4'>
          <FormField
            control={form.control}
            name='batch_size'
            render={({ field: { value, onChange } }) => (
              <FormItem className='flex flex-col gap-4'>
                <FormLabel className='flex justify-between'>
                  每张显卡的batch_size
                  <span>{value}</span>
                </FormLabel>
                <FormControl>
                  <Slider
                    min={1}
                    max={40}
                    step={1}
                    defaultValue={[8]}
                    onValueChange={(vals) => {
                      onChange(vals[0])
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='total_epochs'
            render={({ field: { value, onChange } }) => (
              <FormItem className='flex flex-col gap-4'>
                <FormLabel className='flex justify-between'>
                  总训练轮数total_epoch
                  <span>{value}</span>
                </FormLabel>
                <FormControl>
                  <Slider
                    min={1}
                    max={25}
                    step={1}
                    defaultValue={[15]}
                    onValueChange={(vals) => {
                      onChange(vals[0])
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='save_every_epoch'
            render={({ field: { value, onChange } }) => (
              <FormItem className='flex flex-col gap-4'>
                <FormLabel className='flex justify-between'>
                  保存频率save_every_epoch
                  <span>{value}</span>
                </FormLabel>
                <FormControl>
                  <Slider
                    min={1}
                    max={50}
                    step={1}
                    defaultValue={[5]}
                    onValueChange={(vals) => {
                      onChange(vals[0])
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col space-y-2'>
          <FormField
            control={form.control}
            name='if_dpo'
            render={({ field }) => (
              <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className='space-y-1 leading-none'>
                  <FormLabel>是否开启dpo训练选项(实验性)</FormLabel>
                </div>
              </FormItem>
            )}
          />
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

        <div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
          <Button type='submit' className='h-full'>
            开始训练
          </Button>
          <Textarea
            placeholder='输出信息'
            rows={3}
            readOnly
            className='w-full'
          />
        </div>
      </form>
    </Form>
  )
}

export default function GptTraining() {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>2c. GPT 模型训练</CardTitle>
        <CardDescription>配置并管理 GPT 模型训练参数</CardDescription>
      </CardHeader>
      <CardContent>
        <MyForm />
      </CardContent>
    </Card>
  )
}
