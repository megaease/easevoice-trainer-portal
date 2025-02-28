import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Navigate to='/voice-clone' />
}
