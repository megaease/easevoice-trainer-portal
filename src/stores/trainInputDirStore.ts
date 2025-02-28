import { create } from 'zustand'

interface PathState {
  trainInputDir: string
  setTrainInputDir: (trainInputDir: string) => void
}
export const useTrainInputDirStore = create<PathState>((set) => ({
  trainInputDir: '',
  setTrainInputDir: (trainInputDir: string) => set({ trainInputDir }),
}))
