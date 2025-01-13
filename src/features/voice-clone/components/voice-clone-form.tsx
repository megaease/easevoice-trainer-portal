import { useCallback, useState } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import AudioPlayer from '@/components/audio-player'
import { AudioState } from '@/components/audio-player/type'

const formSchema = z.object({
  SoVITS: z.string(),
  gpt: z.string(),
  audio: z.array(z.string()),
  text: z.string(),
  language: z.string(),
  text2: z.string(),
})

export default function VoiceCloneForm() {
  const [audioState, setAudioState] = useState<AudioState>({
    url: null,
    duration: '0s',
    name: 'recording.wav',
  })
  const handleAudioStateChange = useCallback((audioState: AudioState) => {
    setAudioState(audioState)
  }, [])

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
    }
  }
  console.log('audioState', audioState)
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8 max-w-3xl mx-auto h-full p-4 '
      >
        <section className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>第一步：声音和文本</CardTitle>
            </CardHeader>
            <CardContent>
              <AudioPlayer
                onAudioStateChange={handleAudioStateChange}
              ></AudioPlayer>
            </CardContent>
          </Card>
        </section>
        <section className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>第二步：模型和参数</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name='SoVITS'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SoVITS模型</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='请选择SoVITS模型' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='m@example.com'>
                          m@example.com
                        </SelectItem>
                        <SelectItem value='m@google.com'>
                          m@google.com
                        </SelectItem>
                        <SelectItem value='m@support.com'>
                          m@support.com
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='gpt'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GPT模型</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='请选择GPT模型' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='m@example.com'>
                          m@example.com
                        </SelectItem>
                        <SelectItem value='m@google.com'>
                          m@google.com
                        </SelectItem>
                        <SelectItem value='m@support.com'>
                          m@support.com
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-12 gap-4'>
                <div className='col-span-8 h-full'>
                  <FormField
                    control={form.control}
                    name='text2'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>参考音频的文本</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='请输入参考音频的文本'
                            {...field}
                            className=''
                            rows={5}
                          />
                        </FormControl>
                        <FormDescription>
                          You can @mention other users and organizations.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='col-span-4 gap-4 space-y-4'>
                  <FormField
                    control={form.control}
                    name='language'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>参考音频的语种</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder='
                        选择参考音频的语种
                        '
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='m@example.com'>中文</SelectItem>
                            <SelectItem value='m@google.com'>英文</SelectItem>
                            <SelectItem value='m@support.com'>日文</SelectItem>
                          </SelectContent>
                        </Select>
                        {/* <FormDescription>
                    You can manage email addresses in your email settings.
                  </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='language'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>需要合成的语种</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder='
                        选择需要合成的语种
                        '
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='m@example.com'>中文</SelectItem>
                            <SelectItem value='m@google.com'>英文</SelectItem>
                            <SelectItem value='m@support.com'>日文</SelectItem>
                          </SelectContent>
                        </Select>
                        {/* <FormDescription></FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        <Button
          type='submit'
          className='w-full hover:shadow-lg hover:shadow-blue-200 transition-shadow'
          size={'lg'}
        >
          开始合成
        </Button>
      </form>
    </Form>
  )
}
