import { useQuery } from '@tanstack/react-query'
import namespaceApi from '@/apis/namespace'
import { useNamespaceStore } from '@/stores/namespaceStore'

type Namespace = {
  name: string
  homePath: string
  createdAt: string
}

type NamespaceList = {
  namespaces: Namespace[]
}

export function useNamespaceList() {
  const { currentNamespace, setCurrentNamespace } = useNamespaceStore()
  const query = useQuery<NamespaceList>({
    queryKey: ['namespaces'],
    queryFn: async () => {
      try {
        const res = await namespaceApi.getNamespaces()
        if (!currentNamespace && res.data.namespaces.length > 0) {
          setCurrentNamespace(res.data.namespaces[0])
        }
        if (res.data.namespaces.length === 0) {
          const newNamespace = await namespaceApi.createNamespace({
            name: 'default',
          })
          setCurrentNamespace(newNamespace.data)
        }
        return res.data
      } catch (error) {
        console.log('error', error)
        return { namespaces: [] }
      }
    },
    staleTime: 0,
  })
  return {
    namespaces: query?.data?.namespaces || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  }
}
