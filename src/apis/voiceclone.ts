import apiClient from '@/lib/apiClient'

export type VoiceCloneBodyType = {
  text: string
  text_lang: string
  ref_audio_path: string
  prompt_text: string
  prompt_lang: string
  text_split_method: string
  aux_ref_audio_paths?: string[]
  seed?: number
  top_k?: number
  top_p?: number
  temperature?: number
  batch_size?: number
  speed_factor?: number
  ref_text_free?: boolean
  split_bucket?: boolean
  fragment_interval?: number
  keep_random?: boolean
  parallel_infer?: boolean
  repetition_penalty?: number
  sovits_path?: string
  gpt_path?: string
}

class VoiceCloneApi {
  async getVoiceCloneModels() {
    return await apiClient.get('/voiceclone/models')
  }

  async startVoiceCloneService() {
    return await apiClient.post('/voiceclone/start')
  }

  async stopVoiceCloneService() {
    return await apiClient.post('/voiceclone/stop')
  }

  async getVoiceCloneServiceStatus() {
    return await apiClient.get('/voiceclone/status')
  }

  async cloneVoice(data: VoiceCloneBodyType) {
    return await apiClient.post('/voiceclone/clone', data)
  }
}

export default new VoiceCloneApi()
