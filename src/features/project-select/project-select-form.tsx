import { useEffect } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import namespaceApi from '@/apis/namespace'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useNamespaceStore } from '@/stores/namespaceStore'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const formSchema = z.object({
  namespace: z.string().min(1, '请选择一个项目'),
})

export default function ProjectSelectForm() {
  const { setCurrentNamespace } = useNamespaceStore()
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      namespace: '',
    },
  })

  const {
    data: namespacesData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['namespaces'],
    queryFn: async () => {
      const res = await namespaceApi.getNamespaces()
      return res.data
    },
  })

  const createDefaultNamespace = useMutation({
    mutationFn: async () => {
      return await namespaceApi.createNamespace({
        name: 'default',
        description: '默认项目',
      })
    },
    onSuccess: (data) => {
      toast.success('已创建默认项目')
      refetch()
      //
    },
    onError: (error) => {
      toast.error(
        `创建默认项目失败: ${error instanceof Error ? error.message : '未知错误'}`
      )
    },
  })

  useEffect(() => {
    if (
      namespacesData &&
      namespacesData.namespaces &&
      namespacesData.namespaces.length === 0
    ) {
      createDefaultNamespace.mutate()
    }
  }, [namespacesData])

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const selectedNamespace = namespacesData?.namespaces.find(
        (ns: any) => ns.name === values.namespace
      )

      if (selectedNamespace) {
        setCurrentNamespace(selectedNamespace)
        toast.success(`已选择项目: ${selectedNamespace.name}`)
        navigate({
          to: '/voice-clone',
        })
      }
    } catch (error) {
      console.error('Form submission error', error)
      toast.error('选择项目失败，请重试')
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8 max-w-3xl mx-auto'
      >
        <FormField
          control={form.control}
          name='namespace'
          render={({ field }) => (
            <FormItem>
              <FormLabel>项目名称</FormLabel>
              {isLoading ? (
                <div className='flex items-center space-x-2 h-10 px-3 py-2 border rounded-md'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  <span className='text-muted-foreground'>加载中...</span>
                </div>
              ) : (
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='选择一个项目' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {namespacesData?.namespaces?.map((namespace: any) => (
                      <SelectItem key={namespace.name} value={namespace.name}>
                        {namespace.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <FormDescription>
                克隆和训练模型产生的文件都会保存在项目中
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='text-end w-full'>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                加载中...
              </>
            ) : (
              '确认选择'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
