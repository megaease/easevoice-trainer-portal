import { createFileRoute } from '@tanstack/react-router'
import AdvancedTraining from '@/features/model-training-page/advanced-training'

export const Route = createFileRoute('/_layout/model-training/advanced-mode')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AdvancedTraining />
}
