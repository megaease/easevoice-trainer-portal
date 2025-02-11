import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Namespace = {
  name: string
  homePath: string
  createdAt: string
}

type NamespaceStore = {
  currentNamespace: Namespace | null
  namespaceList: Namespace[]
  setCurrentNamespace: (newNamespace: Namespace) => void
  setNamespaceList: (list: Namespace[]) => void
}

export const useNamespaceStore = create<NamespaceStore>()(
  persist(
    (set) => ({
      currentNamespace: null,
      namespaceList: [],
      setCurrentNamespace: (newNamespace: Namespace | null) =>
        set({ currentNamespace: newNamespace }),
      setNamespaceList: (list) => set({ namespaceList: list }),
    }),
    {
      name: 'namespace-storage',
    }
  )
)
