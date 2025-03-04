import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Directory constants
const VOICES_DIR = 'voices'
const OUTPUTS_DIR = 'outputs'
const TRAINING_AUDIOS_DIR = 'training-audios'
const MODELS_DIR = 'models'
const TRAINING_OUTPUT_DIR = 'training-audios/output'

export type Namespace = {
  name: string
  homePath: string
  createdAt: string
}

type NamespaceStore = {
  currentNamespace: Namespace | null
  setCurrentNamespace: (newNamespace: Namespace) => void
  getVoicesPath: () => string
  getOutputsPath: () => string
  getTrainingAudiosPath: () => string
  getModelsPath: () => string
  getTrainingOutputPath: () => string
}

export const useNamespaceStore = create<NamespaceStore>()(
  persist(
    (set, get) => ({
      currentNamespace: null,
      setCurrentNamespace: (newNamespace: Namespace | null) =>
        set({ currentNamespace: newNamespace }),
      getVoicesPath: () => {
        const currentNamespace = get().currentNamespace
        return currentNamespace
          ? `${currentNamespace.homePath}/${VOICES_DIR}`
          : ''
      },
      getOutputsPath: () => {
        const currentNamespace = get().currentNamespace
        return currentNamespace
          ? `${currentNamespace.homePath}/${OUTPUTS_DIR}`
          : ''
      },
      getTrainingAudiosPath: () => {
        const currentNamespace = get().currentNamespace
        return currentNamespace
          ? `${currentNamespace.homePath}/${TRAINING_AUDIOS_DIR}`
          : ''
      },
      getTrainingOutputPath: () => {
        const currentNamespace = get().currentNamespace
        return currentNamespace
          ? `${currentNamespace.homePath}/${TRAINING_OUTPUT_DIR}`
          : ''
      },
      getModelsPath: () => {
        const currentNamespace = get().currentNamespace
        return currentNamespace
          ? `${currentNamespace.homePath}/${MODELS_DIR}`
          : ''
      },
    }),
    {
      name: 'namespace-storage',
      storage: createJSONStorage(() => localStorage),
      // Handle SSR cases
      skipHydration: typeof window === 'undefined',
    }
  )
)
