import { createFileRoute } from '@tanstack/react-router'
import DataProcess from '@/features/model-training-page/advanced-training/data-process'

export const Route = createFileRoute(
  '/_layout/model-training/advanced-mode/step1'
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <DataProcess />
}
