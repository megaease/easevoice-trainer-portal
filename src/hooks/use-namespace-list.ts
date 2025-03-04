import { useQuery } from '@tanstack/react-query'
import namespaceApi from '@/apis/namespace'

export type Namespace = {
  name: string
  homePath: string
  createdAt: string
}

export function useNamespaceList() {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['namespaces'],
    queryFn: async () => {
      const res = await namespaceApi.getNamespaces()
      return res.data?.namespaces || []
    },
  })

  return {
    namespaces: data as Namespace[],
    isLoading: isLoading || isFetching,
    refetch,
  }
}
