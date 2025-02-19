import { useEffect, useState } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import trainingApi from '@/apis/training'
import { toast } from 'sonner'
import { usePathStore } from '@/stores/pathStore'
import { useUUIDStore } from '@/stores/uuidStore'
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
import { Textarea } from '@/components/ui/textarea'
import AudioTextListEditor from './AudioTextListEditor'

const formSchema = z.object({
  input_dir: z.string().nonempty('输入文件夹路径不能为空'),
  output_dir: z.string().nonempty('输出文件夹路径不能为空'),
})

function MyForm() {
  const [start, setStart] = useState(false)
  const session = useSession()
  const uuid = useUUIDStore((state) => state.refinement)
  const setUUID = useUUIDStore((state) => state.setUUID)
  const refinement = usePathStore((state) => state.refinement)
  const setPaths = usePathStore((state) => state.setPaths)
  const refinementPath = usePathStore((state) => state.refinement)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input_dir: refinementPath.sourceDir,
      output_dir: refinementPath.outputDir,
    },
  })

  useEffect(() => {
    const { sourceDir } = refinement
    if (sourceDir) {
      form.setValue('input_dir', sourceDir)
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
  const query = useQueryClient()
  const startQuery = useQuery({
    queryKey: ['refinementList'],
    queryFn: async () => {
      const data = form.getValues()
      const res = await trainingApi.getRefinementList(data)
      return res.data
    },
    enabled: false,
    staleTime: 0,
  })

  useEffect(() => {
    return () => {
      console.log('cleanup')
      query.resetQueries({ queryKey: 'refinementList', exact: true })
    }
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await startQuery.refetch()
    toast.success('正在启动语音文本校对标注工具')
    session.refetch()
    setPaths('normalize', {
      outputDir: form.getValues('output_dir'),
    })
    setStart(true)
  }
  return (
    <>
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
              disabled
              rows={3}
              value={start ? '请在下方列表进行语音文本校对' : ''}
            />
          </div>
        </form>
      </Form>
      {start ? (
        <AudioTextListEditor data={startQuery.data?.data || {}} />
      ) : null}
    </>
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
        <MyForm />
      </CardContent>
    </Card>
  )
}
