import { create } from 'zustand'

export interface PathState {
  fa: {
    sourceDir: string
    outputDir: string
  }
  fb: {
    sourceDir: string
    outputDir: string
  }
  fc: {
    sourceDir: string
    outputDir: string
  }
  fd: {
    sourceDir: string
    outputDir: string
  }
  fe: {
    sourceDir: string
    outputDir: string
  }
  setPaths: (
    key: keyof PathState,
    value: Partial<PathState[keyof PathState]>
  ) => void
}

export const usePathStore = create<PathState>((set) => ({
  fa: {
    sourceDir: '',
    outputDir: '',
  },
  fb: {
    sourceDir: '',
    outputDir: '',
  },
  fc: {
    sourceDir: '',
    outputDir: '',
  },
  fd: {
    sourceDir: '',
    outputDir: '',
  },
  fe: {
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
