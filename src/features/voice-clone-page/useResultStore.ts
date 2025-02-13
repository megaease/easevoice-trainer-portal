import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AudioState } from '@/components/audio-record-player/type'

interface ResultState {
  cloneResult: AudioState | null
  setCloneResult: (newResult: AudioState | null) => void
}

const useResultStore = create<ResultState>()(
  persist(
    (set) => ({
      cloneResult: null,
      setCloneResult: (newResult: AudioState | null) =>
        set({ cloneResult: newResult }),
    }),
    {
      name: 'clone-result-storage', // unique name
    }
  )
)

export default useResultStore
