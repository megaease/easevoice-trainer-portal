import { create } from 'zustand'
import { AudioState } from '@/components/audio-record-player/type'

interface AudioStore {
  activeTab: 'record' | 'upload'
  audioStates: {
    record: AudioState
    upload: AudioState
  }

  setActiveTab: (tab: 'record' | 'upload') => void
  updateAudioState: (tab: 'record' | 'upload', newState: AudioState) => void
  deleteAudio: () => void
  resetStore: () => void
}

const initialAudioStates = {
  record: { url: null, duration: '0s', name: 'recording.wav' },
  upload: { url: null, duration: '0s', name: 'upload.wav' },
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  activeTab: 'record',
  audioStates: { ...initialAudioStates },

  setActiveTab: (tab) => set({ activeTab: tab }),

  updateAudioState: (tab, newState) => {
    set((state) => ({
      audioStates: {
        ...state.audioStates,
        [tab]: newState,
      },
    }))
  },

  deleteAudio: () => {
    const { activeTab, audioStates } = get()
    const currentState = audioStates[activeTab]

    if (currentState?.url) {
      URL.revokeObjectURL(currentState.url)
    }

    set((state) => ({
      audioStates: {
        ...state.audioStates,
        [activeTab]: {
          url: null,
          duration: '0s',
          name: activeTab === 'record' ? 'recording.wav' : 'upload.wav',
        },
      },
    }))
  },

  // 重置store
  resetStore: () => {
    const { audioStates } = get()
    Object.values(audioStates).forEach((state) => {
      if (state.url) {
        URL.revokeObjectURL(state.url)
      }
    })

    set({
      activeTab: 'record',
      audioStates: { ...initialAudioStates },
    })
  },
}))
