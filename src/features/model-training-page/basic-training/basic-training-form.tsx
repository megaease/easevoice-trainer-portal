import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import trainingAPi from '@/apis/training'
import voicecloneApi from '@/apis/voiceclone'
import { toast } from 'sonner'
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

export default function BasicTrainingForm() {
  const queryClient = useQueryClient()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await trainingAPi.startTraining({
        source_dir: values.source_dir,
      })
      if (response && response.status === 200) {
        toast.success('训练已经开始')
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

  return (
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
  )
}
