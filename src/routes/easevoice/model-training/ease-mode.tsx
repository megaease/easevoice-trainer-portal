import { createFileRoute } from '@tanstack/react-router'
import EaseModeTraining from '@/features/model-training-page/ease-mode-training'

export const Route = createFileRoute('/easevoice/model-training/ease-mode')({
  component: RouteComponent,
})

function RouteComponent() {
  return <EaseModeTraining />
}
