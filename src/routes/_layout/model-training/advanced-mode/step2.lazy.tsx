import { createLazyFileRoute } from '@tanstack/react-router'
import FineTuningTraining from '@/features/model-training-page/advanced-training/fine-tuning-training'

export const Route = createLazyFileRoute(
  '/_layout/model-training/advanced-mode/step2',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <FineTuningTraining />
}
