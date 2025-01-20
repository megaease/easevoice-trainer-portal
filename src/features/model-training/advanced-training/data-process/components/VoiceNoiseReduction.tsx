'use client'

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
  CardFooter,
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

const formSchema = z.object({
  name_1935085247: z.string(),
  name_0785980835: z.string(),
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
        <FormField
          control={form.control}
          name='name_1935085247'
          render={({ field }) => (
            <FormItem>
              <FormLabel>降噪音频文件输入文件夹</FormLabel>
              <FormControl>
                <Input placeholder='shadcn' type='' {...field} />
              </FormControl>
              <FormDescription>降噪音频文件输入文件夹</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='name_0785980835'
          render={({ field }) => (
            <FormItem>
              <FormLabel>降噪结果输出文件夹</FormLabel>
              <FormControl>
                <Input placeholder='shadcn' type='' {...field} />
              </FormControl>
              <FormDescription>降噪结果输出文件夹</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='grid grid-cols-2 gap-4'>
          <Button type='submit' className='h-full'>
            开始语音降噪
          </Button>
          <Textarea placeholder='输出信息' />
        </div>
      </form>
    </Form>
  )
}

export default function VoiceNoiseReduction() {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>3. 语音降噪工具</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <MyForm />
      </CardContent>
    </Card>
  )
}
