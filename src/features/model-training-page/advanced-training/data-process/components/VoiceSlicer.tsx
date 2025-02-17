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
  CardFooter,
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
  source_dir: z.string().nonempty('请输入音频文件路径'),
  output_dir: z.string().nonempty('请输入子音频输出目录'),
  threshold: z.number().min(-100, '阈值不能小于-100').max(0, '阈值不能大于0'),
  min_length: z.number().min(0, '最小长度不能小于0'),
  min_interval: z.number().min(0, '最短切割间隔不能小于0'),
  hop_size: z.number().min(0, 'hop_size不能小于0'),
  max_silent_kept: z.number().min(0, '静音保留时间不能小于0'),
  normalize_max: z
    .number()
    .min(0, '归一化最大值不能小于0')
    .max(1, '归一化最大值不能大于1'),
  alpha_mix: z
    .number()
    .min(0, 'alpha_mix不能小于0')
    .max(1, 'alpha_mix不能大于1'),
  num_process: z
    .number()
    .min(1, '进程数不能小于1')
    .max(112, '进程数不能大于112'),
})

function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source_dir: '',
      output_dir: '',
      threshold: -34,
      min_length: 4000,
      min_interval: 300,
      hop_size: 10,
      max_silent_kept: 500,
      normalize_max: 0.9,
      alpha_mix: 0.25,
      num_process: 4,
    },
  })

  const statusQuery = useQuery<StatusResponse>({
    queryKey: ['VoiceSlicing', 'status'],
    queryFn: async () => {
      const response = await trainingApi.getVoiceSlicingStatus()
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
      return toast.promise(trainingApi.startVoiceSlicing(data), {
        loading: '正在启动语音切割...',
        success: '开始语音切割',
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
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 '>
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-6 space-y-4 '>
            <FormField
              control={form.control}
              name='source_dir'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>音频自动切分输入路径，可文件可文件夹</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='请输入音频文件路径'
                      type=''
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='output_dir'
              render={({ field }) => (
                <FormItem>
                  <FormLabel> 切分后的子音频的输出根目录</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='请输入子音频输出目录'
                      type=''
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='col-span-6'>
              <FormField
                control={form.control}
                name='normalize_max'
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel className='flex justify-between'>
                      Max
                      <span>{value}</span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        defaultValue={[0.9]}
                        onValueChange={(vals) => {
                          onChange(vals[0])
                        }}
                      />
                    </FormControl>
                    <FormDescription>归一化后最大值多少 </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='col-span-6'>
              <FormField
                control={form.control}
                name='alpha_mix'
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel className='flex justify-between'>
                      alpha_mix
                      <span>{value}</span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        defaultValue={[0.25]}
                        onValueChange={(vals) => {
                          onChange(vals[0])
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      混多少比例归一化后音频进来
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='col-span-6'>
              <FormField
                control={form.control}
                name='num_process'
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel className='flex justify-between'>
                      切割使用的进程数
                      <span>{value}</span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={112}
                        step={1}
                        defaultValue={[4]}
                        onValueChange={(vals) => {
                          onChange(vals[0])
                        }}
                      />
                    </FormControl>
                    <FormDescription>切割使用的进程数</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className='col-span-6'>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-6'>
                <FormField
                  control={form.control}
                  name='threshold'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>threshold</FormLabel>
                      <FormControl>
                        <Input placeholder='shadcn' type='' {...field} />
                      </FormControl>
                      <FormDescription>
                        音量小于这个值视作静音的备选切割点
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='col-span-6'>
                <FormField
                  control={form.control}
                  name='min_length'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>min_length</FormLabel>
                      <FormControl>
                        <Input placeholder='shadcn' type='' {...field} />
                      </FormControl>
                      <FormDescription>
                        每段最小多长，如果第一段太短一直和后面段连起来直到超过这个值
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='col-span-6'>
                <FormField
                  control={form.control}
                  name='min_interval'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>min_interval</FormLabel>
                      <FormControl>
                        <Input placeholder='shadcn' type='' {...field} />
                      </FormControl>
                      <FormDescription>最短切割间隔</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='col-span-6'>
                <FormField
                  control={form.control}
                  name='hop_size'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>hop_size</FormLabel>
                      <FormControl>
                        <Input placeholder='shadcn' type='' {...field} />
                      </FormControl>
                      <FormDescription>
                        怎么算音量曲线，越小精度越大计算量越高（不是精度越大效果越好）
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='col-span-6'>
                <FormField
                  control={form.control}
                  name='max_silent_kept'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>max_silent_kept</FormLabel>
                      <FormControl>
                        <Input placeholder='shadcn' type='' {...field} />
                      </FormControl>
                      <FormDescription>切完后静音最多留多长</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
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

export default function VoiceSlicer() {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>2. 音频文件切割</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <MyForm />
      </CardContent>
    </Card>
  )
}
