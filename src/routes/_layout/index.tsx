import { createFileRoute } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'

export const Route = createFileRoute('/_layout/')({
  component: RouteComponent,
})

export default function RouteComponent() {
  return <Main>Home</Main>
}
