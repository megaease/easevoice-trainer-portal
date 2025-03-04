import { createLazyFileRoute } from '@tanstack/react-router'
import EasyModeTraining from '@/features/model-training-page/easy-mode-training'

export const Route = createLazyFileRoute('/_layout/model-training/easy-mode')({
  component: RouteComponent,
})

function RouteComponent() {
  return <EasyModeTraining />
}
