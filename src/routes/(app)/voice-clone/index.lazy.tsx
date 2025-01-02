import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/(app)/voice-clone/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/voice-clone。lazy"!</div>
}
