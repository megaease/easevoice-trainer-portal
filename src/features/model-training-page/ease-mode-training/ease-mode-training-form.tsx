import { useEffect } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import trainingAPi from '@/apis/training'
import { toast } from 'sonner'
import { useUUIDStore } from '@/stores/uuidStore'
import { isTaskRunning, getRequest } from '@/lib/utils'
import { EaseModeTask, useSession } from '@/hooks/use-session'
import { Button } from '@/components/ui/button'
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
import ResultStatus from './ResultStatus'

const formSchema = z.object({
  source_dir: z.string(),
})
const defaultValues = {
  source_dir: '',
}
export default function EaseModeTrainingForm() {
  const queryClient = useQueryClient()
  const session = useSession()
  const uuid = useUUIDStore((state) => state.ease_voice)
  const setUUID = useUUIDStore((state) => state.setUUID)

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
  const { data } = useSession()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await trainingAPi.startTraining({
        source_dir: values.source_dir,
      })
      if (response && response.status === 200) {
        toast.success('训练已经开始')
        setUUID('ease_voice', response.data.uuid)
        queryClient.invalidateQueries(
          {
            queryKey: ['session'],
            exact: true,
            refetchType: 'active',
          },
          { throwOnError: true, cancelRefetch: true }
        )
      }
    } catch (error) {
      console.error('Form submission error', error)
      toast.error(
        '训练开始失败:' + (error as any).response?.data?.detail ||
          '请检查目录是否正确'
      )
    }
  }

  const currentSession = data?.[uuid] as EaseModeTask | null
  const isTaskRunningValue = isTaskRunning(uuid, session.data)

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='source_dir'
            render={({ field }) => (
              <FormItem>
                <FormLabel>训练集音频文件目录</FormLabel>
                <FormControl>
                  <Input
                    placeholder='请输入训练集音频文件目录'
                    type=''
                    {...field}
                  />
                </FormControl>
                <FormDescription>请确保目录中包含您的音频文件</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='grid grid-cols-2 gap-4'>
            <Button
              type='reset'
              size='lg'
              className='w-full'
              onClick={() => {
                setUUID('ease_voice', '')
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
              loading={isTaskRunningValue}
            >
              {isTaskRunningValue ? '任务进行中' : '开始训练'}
            </LoadingButton>
          </div>
        </form>
      </Form>
      <div className='mt-10'>
        <ResultStatus result={currentSession} />
      </div>
    </>
  )
}
