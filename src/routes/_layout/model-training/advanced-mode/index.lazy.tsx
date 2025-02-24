import { createLazyFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_layout/model-training/advanced-mode/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <Navigate to="/model-training/advanced-mode/step1" />
}
