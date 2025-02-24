import { createLazyFileRoute } from '@tanstack/react-router'
import AdvancedTraining from '@/features/model-training-page/advanced-training'

export const Route = createLazyFileRoute(
  '/_layout/model-training/advanced-mode',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <AdvancedTraining />
}
