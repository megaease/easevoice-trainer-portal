import { useQuery } from '@tanstack/react-query'
import namspaceApi from '@/apis/namespace'
import { useNamespaceStore } from '@/stores/namespaceStore'

async function fetchNamespaces(): Promise<string[]> {
  const { data } = await namspaceApi.getNamespaces()
  return data
}

export function useNamespaceList() {
  const { currentNamespace, setCurrentNamespace } = useNamespaceStore()

  const query = useQuery({
    queryKey: ['namespaces'],
    queryFn: fetchNamespaces,
    retry: 1,
  })
  const { data: namespaces = [], isLoading, isError } = query

  if (
    namespaces.length > 0 &&
    !namespaces.find((ns) => ns === currentNamespace)
  ) {
    setCurrentNamespace(namespaces[0] || 'default')
  }
  return {
    namespaces,
    isLoading,
    isError,
  }
}
