import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/(app)/task-list/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/task-list"!</div>
}
