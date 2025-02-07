import { useEffect } from 'react'
import { useNamespaceStore } from '@/stores/namespaceStore'
import { useNamespaceList } from '@/hooks/use-namespace-list'
import { Spinner } from './ui/Spinner'

const NamespaceProvider = ({ children }: { children: React.ReactNode }) => {
  const { namespaceList } = useNamespaceStore()
  const { isLoading } = useNamespaceList()

  useEffect(() => {
    if (
      namespaceList &&
      namespaceList.length > 0 &&
      !useNamespaceStore.getState().currentNamespace
    ) {
      const defaultNamespace = namespaceList[0]
      useNamespaceStore.getState().setCurrentNamespace(defaultNamespace)
    }
  }, [namespaceList, isLoading])

  if (isLoading || !namespaceList) {
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
