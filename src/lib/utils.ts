import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Tasks } from '@/hooks/use-session'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSessionMessage(uuid: string, session: Tasks | undefined) {
  if (!session || !uuid || !session[uuid]) return ''
  const status = session?.[uuid]?.status
  if (status === 'Running') {
    return session?.[uuid]?.status + '...'
  }
  if (status === 'Failed') {
    return session?.[uuid]?.error + ''
  } else {
    return session?.[uuid]?.message + ''
  }
}

export function getErrorMessage(error: any) {
  return (
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.data ||
    error?.message ||
    error
  )
}

export function getDisabledSubmit(
  uuid: string,
  session: Tasks | undefined
): boolean {
  // disable submit button when the task is running
  if (!uuid || !session || !session[uuid]) return false
  return session[uuid].status === 'Running'
}
