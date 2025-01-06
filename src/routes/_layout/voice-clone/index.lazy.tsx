import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_layout/voice-clone/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/voice-clone。lazy"!</div>
}
