import { createLazyFileRoute } from '@tanstack/react-router'
import VoiceClonePage from '@/features/voice-clone-page'

export const Route = createLazyFileRoute('/easevoice/voice-clone/')({
  component: VoiceClonePage,
})
