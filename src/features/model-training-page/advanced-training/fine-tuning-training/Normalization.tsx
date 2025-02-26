import { useEffect } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import trainingApi from '@/apis/training'
import { toast } from 'sonner'
import { usePathStore } from '@/stores/pathStore'
import { useUUIDStore } from '@/stores/uuidStore'
import { getRequest, getSessionMessage, isTaskRunning } from '@/lib/utils'
import { useSession } from '@/hooks/use-session'
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
import { LoadingButton } from '@/components/ui/loading-button'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  output_dir: z.string().nonempty('输出文件夹路径不能为空'),
})
const defaultValues = { output_dir: '' }
function NormalizationForm() {
  const session = useSession()
  const uuid = useUUIDStore((state) => state.normalize)
  const setUUID = useUUIDStore((state) => state.setUUID)
  const normalize = usePathStore((state) => state.normalize)
  const setPaths = usePathStore((state) => state.setPaths)
  const request = getRequest(uuid, session.data) as z.infer<
    typeof formSchema
  > | null
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })
  useEffect(() => {
    if (request) {
      form.reset(request)
    }
  }, [request, form])

  useEffect(() => {
    const { outputDir } = normalize
    if (outputDir) {
      form.setValue('output_dir', outputDir)
    }
  }, [normalize, form])

  const startMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await trainingApi.startNormalization(data)
      return res.data
    },
    onSuccess: async (data) => {
      toast.success('文本归一化已启动')
      setUUID('normalize', data.uuid)
      await session.refetch()
      const normalizePath = data.data.normalize_path
      setPaths('sovits', {
        sourceDir: normalizePath,
        outputDir: form.getValues('output_dir'),
      })
      setPaths('gpt', {
        sourceDir: normalizePath,
        outputDir: form.getValues('output_dir'),
      })
      //todo sovits
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await startMutation.mutateAsync(values)
  }

  const message = getSessionMessage(uuid, session.data)
  const isTaskRunningValue = isTaskRunning(uuid, session.data)

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
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2 h-full'>
            <Button
              type='reset'
              size='lg'
              className='w-full'
              onClick={() => {
                setUUID('normalize', '')
                form.reset(defaultValues)
              }}
              variant={'outline'}
              disabled={isTaskRunningValue}
            >
              重置
            </Button>
            <LoadingButton
              type='submit'
              className='w-full'
              loading={isTaskRunning(uuid, session.data)}
            >
              {isTaskRunningValue ? '任务进行中' : '开始归一化'}
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

export default function Normalization() {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>2a. 文本归一化</CardTitle>
      </CardHeader>
      <CardContent>
        <NormalizationForm />
      </CardContent>
    </Card>
  )
}
