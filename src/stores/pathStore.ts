import { create } from 'zustand'

interface Path {
  sourceDir: string
  outputDir: string
}

interface PathState {
  urv5: Path
  slicer: Path
  denoise: Path
  asr: Path
  refinement: Path
  normalize: Path
  sovits: Path
  gpt: Path
  setPaths: (
    key: keyof PathState,
    value: Partial<PathState[keyof PathState]>
  ) => void
}
export const usePathStore = create<PathState>((set) => ({
  urv5: {
    sourceDir: '',
    outputDir: '',
  },
  slicer: {
    sourceDir: '',
    outputDir: '',
  },
  denoise: {
    sourceDir: '',
    outputDir: '',
  },
  asr: {
    sourceDir: '',
    outputDir: '',
  },
  refinement: {
    sourceDir: '',
    outputDir: '',
  },
  normalize: {
    sourceDir: '',
    outputDir: '',
  },
  sovits: {
    sourceDir: '',
    outputDir: '',
  },
  gpt: {
    sourceDir: '',
    outputDir: '',
  },
  setPaths: (
    key: keyof PathState,
    value: Partial<PathState[keyof PathState]>
  ) => {
    set((state) => ({
      [key]: {
        ...state[key],
        ...value,
      },
    }))
  },
}))
