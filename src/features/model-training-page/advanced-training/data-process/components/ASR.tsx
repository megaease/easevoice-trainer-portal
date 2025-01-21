import React from 'react'
import { useState } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
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
  FormDescription,
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
  name_6694599641: z.string(),
  name_5263935907: z.string(),
  name_8539428883: z.string(),
  name_8349896515: z.string(),
  name_6435468607: z.string(),
  name_4000719979: z.string(),
})

function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values)
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
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-6'>
            <FormField
              control={form.control}
              name='name_6694599641'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>输入文件夹路径</FormLabel>
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
          </div>

          <div className='col-span-6'>
            <FormField
              control={form.control}
              name='name_5263935907'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>输出文件夹路径</FormLabel>
                  <FormControl>
                    <Input placeholder='output/asr_opt' type='' {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
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
              name='name_8539428883'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ASR 模型</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a verified email to display' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='m@example.com'>
                        m@example.com
                      </SelectItem>
                      <SelectItem value='m@google.com'>m@google.com</SelectItem>
                      <SelectItem value='m@support.com'>
                        m@support.com
                      </SelectItem>
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
              name='name_8349896515'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ASR 模型尺寸</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a verified email to display' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='m@example.com'>
                        m@example.com
                      </SelectItem>
                      <SelectItem value='m@google.com'>m@google.com</SelectItem>
                      <SelectItem value='m@support.com'>
                        m@support.com
                      </SelectItem>
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
              name='name_6435468607'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ASR 语言设置</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a verified email to display' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='m@example.com'>
                        m@example.com
                      </SelectItem>
                      <SelectItem value='m@google.com'>m@google.com</SelectItem>
                      <SelectItem value='m@support.com'>
                        m@support.com
                      </SelectItem>
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
              name='name_4000719979'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>数据类型精度</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a verified email to display' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='m@example.com'>
                        m@example.com
                      </SelectItem>
                      <SelectItem value='m@google.com'>m@google.com</SelectItem>
                      <SelectItem value='m@support.com'>
                        m@support.com
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <Button type='submit' className='h-full'>
            开始语音切割
          </Button>
          <Textarea placeholder='输出信息' />
        </div>
      </form>
    </Form>
  )
}

export default function ASR() {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>4. 中文批量ASR工具</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <MyForm />
      </CardContent>
    </Card>
  )
}
