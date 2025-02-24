import { createLazyFileRoute } from '@tanstack/react-router'
import { About } from '@/features/about'

export const Route = createLazyFileRoute('/easevoice/about/')({
  component: About,
})
