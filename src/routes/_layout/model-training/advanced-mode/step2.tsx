import { createFileRoute } from '@tanstack/react-router'
import FineTuningTraining from '@/features/model-training-page/advanced-training/fine-tuning-training'

export const Route = createFileRoute(
  '/_layout/model-training/advanced-mode/step2'
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <FineTuningTraining />
}
