import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import namespaceApi from '@/apis/namespace'
import { toast } from 'sonner'
import { useNamespaceStore } from '@/stores/namespaceStore'
import { useNamespaceList } from '@/hooks/use-namespace-list'
import { Spinner } from './ui/Spinner'

const NamespaceProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentNamespace, setCurrentNamespace, setNamespaceList } =
    useNamespaceStore()
  const { namespaces, isLoading, isError } = useNamespaceList()

  const createNamespaceMutation = useMutation({
    mutationFn: namespaceApi.createNamespace,
    onSuccess: () => {
      toast.success('命名空间创建成功')
    },
  })

  useEffect(() => {
    if (namespaces?.length === 0) {
      console.log('createNamespaceMutation.mutate')
      // createNamespaceMutation.mutate({ name: 'default' })
    }
    if (namespaces?.length > 0) {
      console.log('useEffect', namespaces)
      setNamespaceList(namespaces)
    }
    if (namespaces?.length > 0 && !currentNamespace) {
      setCurrentNamespace(namespaces[0])
    }
  }, [currentNamespace, setCurrentNamespace, isLoading])

  if (isLoading || !namespaces) {
    return (
      <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm'>
        <Spinner>
          <span>正在加载</span>
        </Spinner>
      </div>
    )
  }

  return <>{children}</>
}

export default NamespaceProvider
