import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Namespace = {
  name: string
  homePath: string
  createdAt: string
}

type NamespaceStore = {
  currentNamespace: Namespace | null
  setCurrentNamespace: (newNamespace: Namespace) => void
}

export const useNamespaceStore = create<NamespaceStore>()(
  persist(
    (set) => ({
      currentNamespace: null,
      setCurrentNamespace: (newNamespace: Namespace | null) =>
        set({ currentNamespace: newNamespace }),
    }),
    {
      name: 'namespace-storage',
    }
  )
)
