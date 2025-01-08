import { useState } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CloudUpload, Paperclip } from 'lucide-react'
import { text } from 'stream/consumers'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from '@/components/ui/file-upload'
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
import { SectionTitle } from '@/components/section-title'

const dropZoneConfig = {
  maxFiles: 1,
  maxSize: 1024 * 1024 * 4,
  multiple: true,
}
const formSchema = z.object({
  SoVITS: z.string(),
  gpt: z.string(),
  audio: z.array(z.string()),
  text: z.string(),
  language: z.string(),
  text2: z.string(),
})

export default function SelectModelForm() {
  const [files, setFiles] = useState<File[] | null>(null)
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8 max-w-3xl mx-auto h-full p-4'
      >
        <SectionTitle title='第一步：选择模型' desc='' />

        <FormField
          control={form.control}
          name='SoVITS'
          render={({ field }) => (
            <FormItem>
              <FormLabel>SoVITS模型</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='请选择SoVITS模型' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='m@example.com'>m@example.com</SelectItem>
                  <SelectItem value='m@google.com'>m@google.com</SelectItem>
                  <SelectItem value='m@support.com'>m@support.com</SelectItem>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='请选择GPT模型' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='m@example.com'>m@example.com</SelectItem>
                  <SelectItem value='m@google.com'>m@google.com</SelectItem>
                  <SelectItem value='m@support.com'>m@support.com</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <SectionTitle title='第二步：声音克隆' desc='' />
        <FormField
          control={form.control}
          name='text'
          render={({ field }) => (
            <FormItem>
              <FormLabel>要合成的音频文本</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='请输入要合成的音频文本'
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
        <FormField
          control={form.control}
          name='audio'
          render={() => (
            <FormItem>
              <FormLabel>上传参考音频</FormLabel>
              <FormControl>
                <FileUploader
                  value={files}
                  onValueChange={setFiles}
                  dropzoneOptions={dropZoneConfig}
                  className='relative bg-background rounded-lg p-2'
                >
                  <FileInput
                    id='fileInput'
                    className='outline-dashed outline-1 outline-slate-500'
                  >
                    <div className='flex items-center justify-center flex-col p-8 w-full '>
                      <CloudUpload className='text-gray-500 w-10 h-10' />
                      <p className='mb-1 text-sm text-gray-500 dark:text-gray-400'>
                        <span className='font-semibold'>Click to upload</span>
                        &nbsp; or drag and drop
                      </p>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        SVG, PNG, JPG or GIF
                      </p>
                    </div>
                  </FileInput>
                  <FileUploaderContent>
                    {files &&
                      files.length > 0 &&
                      files.map((file, i) => (
                        <FileUploaderItem
                          key={i}
                          index={i}
                          className='h-auto border flex items-center justify-between rounded-lg
                            hover:bg-white px-4
                          '
                        >
                          <Paperclip className='h-4 w-4 stroke-current' />
                          <span>{file.name}</span>
                          <audio
                            controls
                            src={URL.createObjectURL(file)}
                            className='bg-white p-0'
                          />
                        </FileUploaderItem>
                      ))}
                  </FileUploaderContent>
                </FileUploader>
              </FormControl>

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
        <Button type='submit' className='w-full'>
          开始合成
        </Button>
      </form>
    </Form>
  )
}
