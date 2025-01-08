import { createLazyFileRoute } from '@tanstack/react-router'
import Tasks from '@/features/tasks'

export const Route = createLazyFileRoute('/_layout/task-list/')({
  component: Tasks,
})
