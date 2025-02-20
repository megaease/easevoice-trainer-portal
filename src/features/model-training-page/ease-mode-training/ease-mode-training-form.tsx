import { useState } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import trainingAPi from '@/apis/training'
import { toast } from 'sonner'
import { useSession } from '@/hooks/use-session'
import { Task } from '@/hooks/use-session'
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

const formSchema = z.object({
  source_dir: z.string(),
})

export default function EaseModeTrainingForm() {
  const queryClient = useQueryClient()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  const { data } = useSession()
  const [uuid, setUuid] = useState<string>('')
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await trainingAPi.startTraining({
        source_dir: values.source_dir,
      })
      if (response && response.status === 200) {
        toast.success('训练已经开始')
        setUuid(response.data.uuid)
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

  const currentSession = data?.[uuid] as Task | null

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

          <Button type='submit' className='w-full'>
            开始训练
          </Button>
        </form>
      </Form>
      <div className='space-y-4 mt-6 border p-4 text-sm rounded-sm min-h-[100px]'>
        <div>
          <h1 className='font-semibold leading-none tracking-tight mb-4 text-md'>
            训练状态
          </h1>
          {currentSession ? (
            <>
              <p>任务名称: {currentSession.task_name}</p>
              <p>状态: {currentSession.status}</p>
              {currentSession.error && <p>错误: {currentSession.error}</p>}
              {currentSession.message && <p>信息: {currentSession.message}</p>}
            </>
          ) : (
            <p>暂无训练任务，请提交训练任务后查看状态</p>
          )}
        </div>
      </div>
    </>
  )
}
