import { useEffect, useCallback } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import trainingApi from '@/apis/training'
import { toast } from 'sonner'
import { useNamespaceStore } from '@/stores/namespaceStore'
import { usePathStore } from '@/stores/pathStore'
import { useUUIDStore } from '@/stores/uuidStore'
import { isTaskRunning, getRequest, getSessionMessage } from '@/lib/utils'
import { useSession } from '@/hooks/use-session'
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
import { LoadingButton } from '@/components/ui/loading-button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  model_name: z.string().nonempty('模型不能为空'),
  source_dir: z.string().nonempty('音频文件夹路径不能为空'),
  output_dir: z.string().nonempty('输出文件夹路径不能为空'),
  audio_format: z.string().nonempty('导出文件格式不能为空'),
})

const models = [
  'HP5_only_main_vocal',
  'Onnx_dereverb_By_FoxJoy',
  'HP2-人声vocals+非人声instrumentals',
  'HP2_all_vocals',
  'HP3_all_vocals',
  'HP5-主旋律人声vocals+其他instrumentals',
  'VR-DeEchoAggressive',
  'VR-DeEchoDeReverb',
  'VR-DeEchoNormal',
]
const defaultValues = {
  model_name: 'HP5_only_main_vocal',
  source_dir: '',
  output_dir: '',
  audio_format: 'wav',
}

function MyForm() {
  const session = useSession()
  const uuid = useUUIDStore((state) => state.urv5)
  const setUUID = useUUIDStore((state) => state.setUUID)

  const request = getRequest(uuid, session.data) as z.infer<
    typeof formSchema
  > | null

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  })
  const { getTrainingAudiosPath, getTrainingOutputPath } = useNamespaceStore()
  const sourcePath = getTrainingAudiosPath()
  const outputPath = getTrainingOutputPath()
  useEffect(() => {
    if (sourcePath) {
      form.setValue('source_dir', sourcePath, { shouldValidate: true })
    }
    if (outputPath) {
      form.setValue('output_dir', outputPath, { shouldValidate: true })
    }
  }, [form, sourcePath, outputPath])

  useEffect(() => {
    if (request) {
      form.reset(request)
    }
  }, [request, form])

  const startMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await trainingApi.startVoiceExtraction(data)
      return res.data
    },
    onSuccess: (data) => {
      toast.success('已开始主人声分离')
      setUUID('urv5', data.uuid)
      session.refetch()
    },
    onError: (error) => {
      toast.error(
        `主人声分离失败: ${error instanceof Error ? error.message : '未知错误'}`
      )
    },
  })

  const handleReset = () => {
    setUUID('urv5', '')
    form.reset(defaultValues)
    if (sourcePath) {
      form.setValue('source_dir', sourcePath, { shouldValidate: true })
    }
    if (outputPath) {
      form.setValue('output_dir', outputPath, { shouldValidate: true })
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await startMutation.mutateAsync(values)
  }

  const message = getSessionMessage(uuid, session.data)
  const isTaskRunningValue = isTaskRunning(uuid, session.data)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 w-full'>
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-6'>
            <FormField
              control={form.control}
              name='model_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>模型</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='请选择模型' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='col-span-6'>
            <FormField
              control={form.control}
              name='source_dir'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>音频输入文件夹路径</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='音频文件夹路径'
                      type='text'
                      disabled
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    请将音频文件放在此目录下，目录中的音频文件将作为输入
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className='grid grid-cols-12 gap-4'>
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
          <div className='col-span-6'>
            <FormField
              control={form.control}
              name='audio_format'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <FormLabel>导出文件格式</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className='flex flex-col space-y-1'
                    >
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='wav' />
                        </FormControl>
                        <FormLabel className='font-normal'>wav</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='flac' />
                        </FormControl>
                        <FormLabel className='font-normal'>flac</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='mp3' />
                        </FormControl>
                        <FormLabel className='font-normal'>mp3</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='m4a' />
                        </FormControl>
                        <FormLabel className='font-normal'>m4a</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className='grid grid-cols-2 w-full gap-4'>
          <div className='space-y-2 h-full'>
            <Button
              type='reset'
              size='lg'
              className='w-full'
              onClick={handleReset}
              variant={'outline'}
              disabled={isTaskRunningValue}
            >
              重置
            </Button>
            <LoadingButton
              type='submit'
              className='w-full'
              loading={isTaskRunningValue || startMutation.isPending}
            >
              {isTaskRunningValue ? '任务进行中' : '开始分离'}
            </LoadingButton>
          </div>

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

export default function URV5() {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>1a. 主人声分离</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <MyForm />
      </CardContent>
    </Card>
  )
}
