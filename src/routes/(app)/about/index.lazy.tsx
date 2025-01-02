import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/(app)/about/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/about"!</div>
}
