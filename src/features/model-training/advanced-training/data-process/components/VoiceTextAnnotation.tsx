import { useState } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
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
  name_9709018064: z.string(),
})

function MyForm({ onStart }: { onStart: () => void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values)
      onStart()
      toast(
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(values, null, 2)}</code>
        </pre>
      )
    } catch (error) {
      console.error('Form submission error', error)
      toast.error('Failed to submit the form. Please try again.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='name_9709018064'
          render={({ field }) => (
            <FormItem>
              <FormLabel>.list标注文件的路径</FormLabel>
              <FormControl>
                <Input placeholder='shadcn' type='' {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='grid grid-cols-2 gap-4'>
          <Button type='submit' className='h-full'>
            开始标注
          </Button>
          <Textarea placeholder='输出信息' />
        </div>
      </form>
    </Form>
  )
}
export default function VoiceTextAnnotation() {
  const [startAnnotation, setStartAnnotation] = useState(false)

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>5. 语音文本校对标注工具</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent>
        {startAnnotation ? (
          <div>
            <AudioTextListEditor
              onFinished={() => {
                toast.success('标注完成')
                setStartAnnotation(false)
              }}
            />
          </div>
        ) : (
          <MyForm
            onStart={() => {
              setStartAnnotation(true)
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}
