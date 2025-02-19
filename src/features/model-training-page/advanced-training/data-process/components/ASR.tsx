import { useEffect } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import trainingApi from '@/apis/training'
import { toast } from 'sonner'
import { usePathStore } from '@/stores/pathStore'
import { useUUIDStore } from '@/stores/uuidStore'
import {
  getDisabledSubmit,
  getErrorMessage,
  getSessionMessage,
} from '@/lib/utils'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  source_dir: z.string().nonempty('输入文件夹路径不能为空'),
  output_dir: z.string().nonempty('输出文件夹路径不能为空'),
  asr_model: z.string().nonempty('请选择 ASR 模型'),
  model_size: z.string().nonempty('请选择模型尺寸'),
  language: z.string().nonempty('请选择语言'),
  precision: z.string().nonempty('请选择精度'),
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
  const session = useSession()
  const uuid = useUUIDStore((state) => state.asr)
  const setUUID = useUUIDStore((state) => state.setUUID)
  const asr = usePathStore((state) => state.asr)
  const setPaths = usePathStore((state) => state.setPaths)

  const startMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await trainingApi.startAudioTranscription(data)
      return res.data
    },
    onSuccess: (data) => {
      toast.success('音频转文字已启动')
      setUUID('asr', data.uuid)
      session.refetch()
      setPaths('refinement', {
        sourceDir: form.getValues('source_dir'),
      })
    },
    onError: (error: any) => {
      console.log(error)
      toast.error(getErrorMessage(error) || '启动失败，请重试')
    },
  })
  useEffect(() => {
    const { sourceDir } = asr
    form.setValue('source_dir', sourceDir)
  }, [asr, form])
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
          <Button
            type='submit'
            className='h-full'
            disabled={getDisabledSubmit(uuid, session.data)}
          >
            开始 ASR
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

export default function ASR() {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>1d. 音频转文字</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <MyForm />
      </CardContent>
    </Card>
  )
}
