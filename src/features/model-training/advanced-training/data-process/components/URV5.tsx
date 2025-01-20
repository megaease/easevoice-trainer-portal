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
  model: z.string(),
  folderPath: z.string(),
  name_7045055503: z.string(),
  name_4798549065: z.string(),
  type: z.string(),
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
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 w-full'>
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-6'>
            <FormField
              control={form.control}
              name='model'
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
          <div className='col-span-6'>
            <FormField
              control={form.control}
              name='folderPath'
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
              name='name_7045055503'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>指定人声输出文件夹</FormLabel>
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
              name='name_4798549065'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>指定伴奏的输出文件夹：</FormLabel>
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
        </div>
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-6'>
            <FormField
              control={form.control}
              name='type'
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
                          <RadioGroupItem value='all' />
                        </FormControl>
                        <FormLabel className='font-normal'>wav</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='mentions' />
                        </FormControl>
                        <FormLabel className='font-normal'>flac</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='none' />
                        </FormControl>
                        <FormLabel className='font-normal'>mp3</FormLabel>
                      </FormItem>
                      <FormItem className='flex items-center space-x-3 space-y-0'>
                        <FormControl>
                          <RadioGroupItem value='none' />
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
          <div className='col-span-6 flex flex-col gap-4'>
            <Button type='submit' className='w-full h-full' size='lg'>
              开始分离
            </Button>
            <Textarea placeholder='输出信息' rows={3} />
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
        <CardTitle>1. UVR5人声伴奏分离&去混响去延迟工具</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <MyForm />
      </CardContent>
    </Card>
  )
}
