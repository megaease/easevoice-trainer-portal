import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import trainingApi from '@/apis/training'
import { toast } from 'sonner'
import { usePathStore } from '@/stores/pathStore'
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

function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      model_name: 'HP5_only_main_vocal',
      source_dir: '',
      output_dir: '',
      audio_format: 'wav',
    },
  })

  const startMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return toast.promise(trainingApi.startVoiceExtraction(data), {
        loading: '正在启动主人声提取...',
        success: '开始主人声提取',
        error: '启动失败，请重试',
      })
    },
    onSuccess: () => {},
  })

  const stopMutation = useMutation({
    mutationFn: async () => {
      return toast.promise(trainingApi.stopVoiceExtraction(), {
        loading: '正在停止主人声分离...',
        success: '已停止主人声分离',
        error: '停止失败，请重试',
      })
    },
    onSuccess: () => {},
  })

  const setPaths = usePathStore((state) => state.setPaths) // Get the store function

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await startMutation.mutateAsync(values)
  }

  async function onStop() {
    await stopMutation.mutateAsync()
  }

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
                  <FormLabel>音频文件夹路径</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='音频文件夹路径'
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
          <div className='col-span-12 flex gap-4'>
            <Button type='submit' className='w-full h-full'>
              开始提取
            </Button>
            <Textarea
              placeholder='输出信息'
              rows={3}
              readOnly
              className='w-full'
            />
          </div>
        </div>
      </form>
    </Form>
  )
}

export default function URV5() {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>1a. 主人声提取</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <MyForm />
      </CardContent>
    </Card>
  )
}
