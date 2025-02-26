import { clsx, type ClassValue } from 'clsx'
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

export function isTaskRunning(
  uuid: string,
  session: Tasks | undefined
): boolean {
  // disable submit button when the task is running
  if (!uuid || !session || !session[uuid]) return false
  return session[uuid].status === 'Running'
}

export const getAudioPath = (uuid: string, session: Tasks | undefined) => {
  if (!uuid || !session || !session[uuid]) return ''
  const data = session[uuid]?.data as {
    output_path?: string
  }
  const output_path =
    typeof data === 'object' && data !== null ? data.output_path : ''
  return output_path
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
  const request = data?.[uuid]?.status ? data?.[uuid]?.request : null

  return request
}

export const getModelPath = (uuid: string, session: Tasks | undefined) => {
  if (!uuid || !session || !session[uuid]) return ''
  const data = session[uuid]?.data as {
    model_path?: string
  }
  const modelPath =
    typeof data === 'object' && data !== null ? data.model_path : ''
  return modelPath
}
