import { useQuery } from '@tanstack/react-query'
import { useNamespaceStore } from '@/stores/namespaceStore'

async function fetchNamespaces(): Promise<string[]> {
  // const response = await fetch('/api/namespaces')
  // if (!response.ok) {
  //   throw new Error('获取命名空间列表失败')
  // }
  // return response.json()
  //模拟
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['default', 'test'])
    }, 1000)
  })
}

export function useNamespaceList() {
  const { currentNamespace, setCurrentNamespace } = useNamespaceStore()

  const query = useQuery({
    queryKey: ['namespaces'],
    queryFn: fetchNamespaces,
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
