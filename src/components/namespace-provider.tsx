import { useEffect } from 'react'
import { useNamespaceStore } from '@/stores/namespaceStore'
import { useNamespaceList } from '@/hooks/use-namespace-list'
import { Spinner } from './ui/Spinner'
import { Loading } from './ui/loading'

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
    return <Loading />
  }

  return <>{children}</>
}

export default NamespaceProvider
