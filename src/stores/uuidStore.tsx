import { create } from 'zustand'

interface UUIDState {
  urv5: string
  slicer: string
  denoise: string
  asr: string
  refinement: string
  normalize: string
  sovits: string
  gpt: string
  setUUID: (key: keyof UUIDState, value: string) => void
}
export const useUUIDStore = create<UUIDState>((set) => ({
  urv5: '',
  slicer: '',
  denoise: '',
  asr: '',
  refinement: '',
  normalize: '',
  sovits: '',
  gpt: '',
  setUUID: (key: keyof UUIDState, value: string) => {
    set(() => ({
      [key]: value,
    }))
  },
}))
