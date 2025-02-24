import { createLazyFileRoute } from '@tanstack/react-router'
import ModelTrainingPage from '@/features/model-training-page'

export const Route = createLazyFileRoute('/_layout/model-training')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ModelTrainingPage />
}
