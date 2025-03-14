import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import voicecloneApi from '@/apis/voiceclone'
import { formSchema, VoiceCloneFormData } from '@/types/voiceclone'
import { toast } from 'sonner'
import { useNamespaceStore } from '@/stores/namespaceStore'
import { useUUIDStore } from '@/stores/uuidStore'
import { getRequest, isTaskRunning } from '@/lib/utils'
import { useSession } from '@/hooks/use-session'
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
import { LoadingButton } from '@/components/ui/loading-button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import AudioRecordPlayer from '@/components/audio-record-player'
import { AudioState } from '@/components/audio-record-player/type'
import { CloneResult } from './CloneResult'

const languages = ['auto', 'zh', 'en', 'ja', 'yue', 'ko']
const splitMethods = [
  'no_split',
  'by_4_sentences',
  'by_50_chars',
  'by_chinese_period',
  'by_english_period',
  'by_punctuation',
]
const defaultValues: VoiceCloneFormData = {
  text: '',
  text_lang: 'zh',
  ref_audio_path: '',
  prompt_text: '',
  prompt_lang: 'auto',
  text_split_method: 'by_4_sentences',
  aux_ref_audio_paths: [],
  // seed: -1,
  top_k: 5,
  top_p: 1,
  temperature: 1,
  batch_size: 20,
  speed_factor: 1.0,
  ref_text_free: false,
  split_bucket: true,
  fragment_interval: 0.3,
  keep_random: true,
  parallel_infer: true,
  repetition_penalty: 1.3,
  sovits_path: 'default',
  gpt_path: 'default',
  output_dir: '',
  project_dir: '',
}
export default function VoiceCloneForm() {
  const session = useSession()
  const uuid = useUUIDStore((state) => state.clone)
  const setUUID = useUUIDStore((state) => state.setUUID)
  const request = getRequest(uuid, session.data) as VoiceCloneFormData | null
  const form = useForm<VoiceCloneFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })
  useEffect(() => {
    if (request) {
      form.reset(request)
    }
  }, [request, form])
  const { currentNamespace } = useNamespaceStore()

  const { data: voiceCloneModels, isLoading } = useQuery({
    queryKey: ['voiceCloneModels', currentNamespace?.homePath],
    queryFn: () =>
      voicecloneApi.getVoiceCloneModels({
        project_dir: currentNamespace?.homePath || '',
      }),
  })

  useEffect(() => {
    if (voiceCloneModels?.data) {
      form.setValue('sovits_path', voiceCloneModels.data.sovits[0] || null)
      form.setValue('gpt_path', voiceCloneModels.data.gpts[0] || null)
    }
  }, [voiceCloneModels])

  const [audioState, setAudioState] = useState<AudioState>({
    url: null,
    duration: '',
    name: 'recording.wav',
  })

  const handleAudioStateChange = useCallback((audioState: AudioState) => {
    setAudioState(audioState)
  }, [])

  async function onSubmit(values: VoiceCloneFormData) {
    if (!audioState || !audioState.url) {
      toast.error('请录制或上传音频')
      return
    }
    if (!values.text) {
      toast.error('请输入要合成的文本')
      return
    }
    const projectDir = currentNamespace?.homePath || ''
    const audioPath = projectDir + '/voices/' + audioState.name
    const outputDir = projectDir + '/outputs'
    const data = {
      ...values,
      ref_audio_path: audioPath,
      output_dir: outputDir,
      project_dir: projectDir,
    }

    await cloneMutation.mutateAsync(data)
  }

  const cloneMutation = useMutation({
    mutationFn: async (data: VoiceCloneFormData) => {
      const res = await voicecloneApi.cloneVoice(data)
      return res.data
    },
    onSuccess: async (data) => {
      await session.refetch()
      toast('正在合成声音...')
      setUUID('clone', data.uuid)
    },
  })

  if (isLoading) {
    return (
      <div className='p-4 space-y-8'>
        <Skeleton className='h-[400px] w-full bg-slate-100 dark:bg-gray-700' />
      </div>
    )
  }
  const gptList = voiceCloneModels?.data?.gpts || []
  const sovitsList = voiceCloneModels?.data?.sovits || []
  const isTaskRunningValue =
    isTaskRunning(uuid, session.data) || cloneMutation.isPending

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 max-w-3xl mx-auto h-full p-4'
        >
          <section className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>第一步：声音和文本</CardTitle>
              </CardHeader>
              <CardContent>
                <AudioRecordPlayer
                  onAudioStateChange={handleAudioStateChange}
                  text={
                    <FormField
                      control={form.control}
                      name='text'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder='请输入要合成的文本'
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  }
                ></AudioRecordPlayer>
              </CardContent>
            </Card>
          </section>
          <section className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle>第二步：模型和参数</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FormField
                  control={form.control}
                  name='sovits_path'
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
                          {sovitsList.map((sovits: string) => (
                            <SelectItem key={sovits} value={sovits}>
                              {sovits}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='gpt_path'
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
                          {gptList.map((gpt: string) => (
                            <SelectItem key={gpt} value={gpt}>
                              {gpt}
                            </SelectItem>
                          ))}
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
                      name='prompt_text'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>参考音频的文本</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='请输入参考音频的文本'
                              {...field}
                              className=''
                              rows={10}
                            />
                          </FormControl>
                          <FormDescription>
                            参考音频的文本，可以不填
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='col-span-4 gap-4 space-y-4'>
                    <FormField
                      control={form.control}
                      name='prompt_lang'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>参考音频的语种</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='选择参考音频的语种' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {languages.map((lang) => (
                                <SelectItem key={lang} value={lang}>
                                  {lang}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='text_lang'
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
                              {languages.map((lang) => (
                                <SelectItem key={lang} value={lang}>
                                  {lang}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {/* <FormDescription></FormDescription> */}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='text_split_method'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>文本切分方法</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='选择切分方式' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {splitMethods.map((method) => (
                                <SelectItem key={method} value={method}>
                                  {method}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                  其他配置，如不了解请保持默认
                </div>
                <div className='grid grid-cols-2 gap-8'>
                  <FormField
                    control={form.control}
                    name='speed_factor'
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <div className='flex justify-between gap-2'>
                          <FormLabel>语速</FormLabel>
                          <span>{value}</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0.6}
                            max={1.65}
                            step={0.05}
                            value={[value || 1]}
                            onValueChange={(vals) => {
                              onChange(vals[0])
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='top_k'
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <div className='flex justify-between gap-2'>
                          <FormLabel>top_k</FormLabel>
                          <span>{value}</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={1}
                            max={100}
                            step={1}
                            defaultValue={[5]}
                            onValueChange={(vals) => {
                              onChange(vals[0])
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='top_p'
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <div className='flex justify-between gap-2'>
                          <FormLabel>top_p</FormLabel>
                          <span>{value}</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={1}
                            step={0.05}
                            defaultValue={[1]}
                            onValueChange={(vals) => {
                              onChange(vals[0])
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='temperature'
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <div className='flex justify-between gap-2'>
                          <FormLabel>Temperature</FormLabel>
                          <span>{value}</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={1}
                            step={0.05}
                            defaultValue={[1]}
                            onValueChange={(vals) => {
                              onChange(vals[0])
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </section>
          <div className='space-y-4'>
            <Button
              type='reset'
              size='lg'
              variant='outline'
              className='w-full'
              onClick={() => {
                setUUID('clone', '')
                form.reset(defaultValues)
              }}
              disabled={isTaskRunningValue}
            >
              重置
            </Button>
            <LoadingButton
              type='submit'
              className='w-full hover:shadow-md hover:shadow-blue-200 transition-shadow dark:hover:shadow-blue-800'
              size={'lg'}
              loading={isTaskRunningValue}
            >
              {isTaskRunningValue ? '正在合成声音...' : '开始合成'}
            </LoadingButton>
          </div>
        </form>
      </Form>
      <CloneResult uuid={uuid} />
    </>
  )
}
