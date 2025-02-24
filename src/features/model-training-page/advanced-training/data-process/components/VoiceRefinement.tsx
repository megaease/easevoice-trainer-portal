import { useEffect, useState } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import trainingApi from '@/apis/training'
import { toast } from 'sonner'
import { usePathStore } from '@/stores/pathStore'
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
  output_dir: z.string().nonempty('输出文件夹路径不能为空'),
})

const defaultValues = {
  input_dir: '',
  output_dir: '',
}
function useVoiceRefinementForm() {
  const [start, setStart] = useState(false)
  const session = useSession()
  const refinement = usePathStore((state) => state.refinement)
  const setPaths = usePathStore((state) => state.setPaths)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })
  useEffect(() => {
    const { sourceDir } = refinement
    if (sourceDir) {
      form.setValue('input_dir', sourceDir)
      form.setValue('output_dir', `${sourceDir}/output`)
    }
  }, [refinement, form])

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'input_dir' && value.input_dir) {
        form.setValue('output_dir', `${value.input_dir}/output`)
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  const startQuery = useQuery({
    queryKey: ['refinementList'],
    queryFn: async () => {
      const data = form.getValues()
      const res = await trainingApi.getRefinementList(data)
      return res.data
    },
    enabled: false,
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await startQuery.refetch()
    setStart(true)
    toast.success('正在启动语音文本校对标注工具')
    session.refetch()
    setPaths('normalize', {
      outputDir: form.getValues('output_dir'),
      sourceDir: form.getValues('input_dir'),
    })
  }

  return {
    form,
    start,
    setStart,
    startQuery,
    onSubmit,
  }
}

function VoiceRefinementForm() {
  const { form, start, setStart, startQuery, onSubmit } =
    useVoiceRefinementForm()

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
          <div className='space-y-2 h-full'>
            <Button
              type='reset'
              className='w-full'
              onClick={() => {
                form.reset(defaultValues)
                setStart(false)
              }}
              variant={'outline'}
            >
              重置
            </Button>
            {start ? (
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  setStart(false)
                  toast.success('请点击 "2.训练模型" 进行下一步操作')
                }}
                className='w-full'
                type='button'
              >
                完成标注
              </Button>
            ) : (
              <Button type='submit' className='w-full'>
                开始标注
              </Button>
            )}
          </div>
          <Textarea
            placeholder='输出信息'
            readOnly
            rows={3}
            value={start ? '请在下方列表进行语音文本校对' : ''}
          />
        </div>
      </form>
      {start ? (
        <AudioTextListEditor
          data={startQuery.data?.data || {}}
          sourceDir={form.getValues('input_dir')}
          outputDir={form.getValues('output_dir')}
          refresh={() => startQuery.refetch()}
        />
      ) : null}
    </Form>
  )
}

export default function VoiceRefinement() {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>1e. 语音文本校对标注工具</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <VoiceRefinementForm />
      </CardContent>
    </Card>
  )
}
