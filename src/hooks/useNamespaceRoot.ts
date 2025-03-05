import { useQuery } from '@tanstack/react-query'
import namespaceApi from '@/apis/namespace'

export function useNamespaceRoot() {
  return useQuery({
    queryKey: ['namespaceRoot'],
    queryFn: async () => {
      const res = await namespaceApi.getNamespaceRoot()
      return res.data
    },
  })
}
