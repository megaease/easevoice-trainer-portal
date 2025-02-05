import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type NamespaceStore = {
  currentNamespace: string
  namespaceList: string[]
  setCurrentNamespace: (newNamespace: string) => void
  setNamespaceList: (list: string[]) => void
}

export const useNamespaceStore = create<NamespaceStore>()(
  persist(
    (set) => ({
      currentNamespace: '',
      namespaceList: [],
      setCurrentNamespace: (newNamespace) =>
        set({ currentNamespace: newNamespace }),
      setNamespaceList: (list) => set({ namespaceList: list }),
    }),
    {
      name: 'namespace-storage',
    }
  )
)
