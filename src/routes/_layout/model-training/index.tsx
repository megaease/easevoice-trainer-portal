import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/model-training/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Navigate to="/model-training/ease-mode" />
}
