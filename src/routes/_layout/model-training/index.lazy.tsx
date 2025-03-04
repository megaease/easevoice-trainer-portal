import { createLazyFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_layout/model-training/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Navigate to='/model-training/easy-mode' />
}
