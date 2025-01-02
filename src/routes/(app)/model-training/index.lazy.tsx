import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/(app)/model-training/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/model-traing"!</div>
}
