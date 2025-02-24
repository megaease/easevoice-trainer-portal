import { createFileRoute } from '@tanstack/react-router'
import ModelTrainingPage from '@/features/model-training-page'

export const Route = createFileRoute('/_layout/model-training')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ModelTrainingPage />
}
