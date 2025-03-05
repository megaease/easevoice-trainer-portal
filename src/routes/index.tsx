import { createFileRoute } from '@tanstack/react-router'
import { ProjectSelect } from '@/features/project-select'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProjectSelect />
}
