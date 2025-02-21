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
  output_model_name: z.string(),
})

const defaultValues = {
  batch_size: 8,
  total_epochs: 8,
  text_low_lr_rate: 0.4,
  save_every_epoch: 4,
  if_save_latest: false,
  if_save_every_weights: false,
  gpu_ids: '0',
  pretrained_s2G: 'pretrained/gsv-v2final-pretrained/s2G2333k.pth',
  pretrained_s2D: 'pretrained/gsv-v2final-pretrained/s2D2333k.pth',
  train_input_dir: '',
  output_model_name: '',
}

function MyForm() {
  const session = useSession()
  const sovits = usePathStore((state) => state.sovits)
  const uuid = useUUIDStore((state) => state.sovits)
  const setUUID = useUUIDStore((state) => state.setUUID)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  useEffect(() => {
    const { sourceDir } = sovits
    if (sourceDir) {
      // normalize path
      form.setValue('train_input_dir', sourceDir)
    }
  }, [sovits, form])

  const startMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await trainingApi.startSovitsTraining(data)
      return res.data
    },
    onSuccess: async (data) => {
      await session.refetch()
      toast.success('So-VITS 训练已启动')
      setUUID('sovits', data.uuid)
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await startMutation.mutateAsync(values)
  }
  const message = getSessionMessage(uuid, session.data)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-2 gap-4'>
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
            name='train_input_dir'
            render={({ field }) => (
              <FormItem>
                <FormLabel>训练输入目录</FormLabel>
                <FormControl>
                  <Input placeholder='使用文本归一化生成的目录' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                <FormDescription>
                  可选, 不填则会按照时间戳生成模型名称
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        <div className='grid grid-cols-2 gap-4'>
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
            name='text_low_lr_rate'
            render={({ field: { value, onChange } }) => (
              <FormItem className='flex flex-col gap-4'>
                <FormLabel className='flex justify-between'>
                  文本模块学习率权重
                  <span>{value}</span>
                </FormLabel>
                <FormControl>
                  <Slider
                    min={0.2}
                    max={0.6}
                    step={0.05}
                    defaultValue={[0.4]}
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
                    max={25}
                    step={1}
                    defaultValue={[4]}
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
