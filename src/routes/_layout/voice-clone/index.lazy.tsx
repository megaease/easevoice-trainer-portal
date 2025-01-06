import { createLazyFileRoute } from '@tanstack/react-router'
import VoiceClone from '@/features/voice-clone'

export const Route = createLazyFileRoute('/_layout/voice-clone/')({
  component: VoiceClone,
})
