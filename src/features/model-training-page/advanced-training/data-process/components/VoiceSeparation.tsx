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
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  name_4549257098: z.string(),
  name_0908675173: z.string(),
  name_6719714593: z.string(),
  name_1346033664: z.string(),
  name_5086367083: z.string(),
  name_9393977446: z.string(),
  name_9287274561: z.string(),
  name_2476791895: z.number().min(0).max(1),
  name_9470475002: z.number().min(0).max(1),
  name_0978053114: z.number().min(1).max(112),
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
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 '>
        <div className='grid grid-cols-12 gap-4'>
          <div className='col-span-6 space-y-4 '>
            <FormField
              control={form.control}
              name='name_4549257098'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>音频自动切分输入路径，可文件可文件夹</FormLabel>
                  <FormControl>
                    <Input placeholder='shadcn' type='' {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='name_0908675173'
              render={({ field }) => (
                <FormItem>
                  <FormLabel> 切分后的子音频的输出根目录</FormLabel>
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
            <div className='col-span-6'>
              <FormField
                control={form.control}
                name='name_2476791895'
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel className='flex justify-between'>
                      Max
                      <span>{value}</span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        defaultValue={[5]}
                        onValueChange={(vals) => {
                          onChange(vals[0])
                        }}
                      />
                    </FormControl>
                    <FormDescription>归一化后最大值多少 </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='col-span-6'>
              <FormField
                control={form.control}
                name='name_9470475002'
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel className='flex justify-between'>
                      alpha_mix
                      <span>{value}</span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        defaultValue={[5]}
                        onValueChange={(vals) => {
                          onChange(vals[0])
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      混多少比例归一化后音频进来
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='col-span-6'>
              <FormField
                control={form.control}
                name='name_0978053114'
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <FormLabel className='flex justify-between'>
                      切割使用的进程数
                      <span>{value}</span>
                    </FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={112}
                        step={1}
                        defaultValue={[5]}
                        onValueChange={(vals) => {
                          onChange(vals[0])
                        }}
                      />
                    </FormControl>
                    <FormDescription>切割使用的进程数</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className='col-span-6'>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-6'>
                <FormField
                  control={form.control}
                  name='name_6719714593'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>threshold</FormLabel>
                      <FormControl>
                        <Input placeholder='shadcn' type='' {...field} />
                      </FormControl>
                      <FormDescription>
                        音量小于这个值视作静音的备选切割点
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='col-span-6'>
                <FormField
                  control={form.control}
                  name='name_1346033664'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>min_length</FormLabel>
                      <FormControl>
                        <Input placeholder='shadcn' type='' {...field} />
                      </FormControl>
                      <FormDescription>
                        每段最小多长，如果第一段太短一直和后面段连起来直到超过这个值
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='col-span-6'>
                <FormField
                  control={form.control}
                  name='name_5086367083'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>min_interval</FormLabel>
                      <FormControl>
                        <Input placeholder='shadcn' type='' {...field} />
                      </FormControl>
                      <FormDescription>最短切割间隔</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='col-span-6'>
                <FormField
                  control={form.control}
                  name='name_9393977446'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>hop_size</FormLabel>
                      <FormControl>
                        <Input placeholder='shadcn' type='' {...field} />
                      </FormControl>
                      <FormDescription>
                        怎么算音量曲线，越小精度越大计算量越高（不是精度越大效果越好）
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='col-span-6'>
                <FormField
                  control={form.control}
                  name='name_9287274561'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>max_sil_kept</FormLabel>
                      <FormControl>
                        <Input placeholder='shadcn' type='' {...field} />
                      </FormControl>
                      <FormDescription>切完后静音最多留多长</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
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

export default function VoiceSeparation() {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>2. 语音切分工具</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <MyForm />
      </CardContent>
    </Card>
  )
}
