import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AudioState } from '@/components/audio-record-player/type'

interface ResultState {
  cloneResults: AudioState[]
  setCloneResults: (newResults: AudioState[]) => void
}

const useResultStore = create<ResultState>()(
  persist(
    (set) => ({
      cloneResults: [],
      setCloneResults: (newResults: AudioState[]) => {
        set({ cloneResults: newResults })
      },
    }),
    {
      name: 'clone-results-storage', // unique name
    }
  )
)

export default useResultStore
