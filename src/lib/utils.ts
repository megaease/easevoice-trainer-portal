import { clsx, type ClassValue } from 'clsx'
import dayjs from 'dayjs'
import { twMerge } from 'tailwind-merge'
import { UUIDState } from '@/stores/uuidStore'
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

export const getAudio = (uuid: string, session: Tasks | undefined) => {
  if (!uuid || !session || !session[uuid]) return ''
  const data = session[uuid]?.data
  const audio = typeof data === 'object' && data !== null ? data.audio : ''
  if (!audio) return ''
  const base64Url = `data:audio/wav;base64,${audio}`
  const result = {
    url: base64Url,
    duration: '',
    name: 'result_' + dayjs().format() + '.wav',
  }
  result.name = result.name.replace(/ /g, '_')
  return result
}

export const isRunningVoiceClone = (session: Tasks | undefined) => {
  if (!session) return false
  return Object.values(session).some((task) => task.status === 'Running')
}

export const audioProcessesMap: Record<string, keyof UUIDState> = {
  voice_clone: 'clone',
  train_sovits: 'sovits',
  train_gpt: 'gpt',
  ease_voice: 'ease_voice',
  normalize: 'normalize',
  audio_uvr5: 'urv5',
  audio_slicer: 'slicer',
  audio_denoise: 'denoise',
  audio_asr: 'asr',
}

export const getRequest = (uuid: string, data: Tasks | undefined) => {
  const request =
    data?.[uuid]?.status === 'Running' ? data?.[uuid]?.request : null

  return request
}
