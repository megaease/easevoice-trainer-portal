import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/easevoice/model-training/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Navigate to='/easevoice/model-training/ease-mode' />
}
