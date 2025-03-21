import { create } from 'zustand'

export interface UUIDState {
  clone: string
  urv5: string
  slicer: string
  denoise: string
  asr: string
  refinement: string
  normalize: string
  sovits: string
  ease_voice: string
  gpt: string
  current: string
  setUUID: (key: keyof UUIDState, value: string) => void
}
export const useUUIDStore = create<UUIDState>((set) => ({
  clone: '',
  urv5: '',
  slicer: '',
  denoise: '',
  asr: '',
  refinement: '',
  normalize: '',
  sovits: '',
  gpt: '',
  ease_voice: '',
  current: '',
  setUUID: (key: keyof UUIDState, value: string) => {
    set(() => ({
      [key]: value,
      current: value,
    }))
  },
}))
