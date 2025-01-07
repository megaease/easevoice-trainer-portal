import { createLazyFileRoute } from '@tanstack/react-router'
import ModelTraining from '@/features/model-training'

export const Route = createLazyFileRoute('/_layout/model-training/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ModelTraining />
}
