import { createLazyFileRoute } from '@tanstack/react-router'
import { About } from '@/features/about'

export const Route = createLazyFileRoute('/_layout/about/')({
  component: About,
})
