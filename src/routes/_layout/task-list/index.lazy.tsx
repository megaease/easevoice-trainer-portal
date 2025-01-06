import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_layout/task-list/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(app)/task-list"!</div>
}
