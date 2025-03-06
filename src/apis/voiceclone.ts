import { VoiceCloneFormData } from '@/types/voiceclone'
import apiClient from '@/lib/apiClient'

class VoiceCloneApi {
  async getVoiceCloneModels(params: { project_dir: string }) {
    return await apiClient.get('/voiceclone/models', {
      params,
    })
  }

  async cloneVoice(data: VoiceCloneFormData) {
    return await apiClient.post('/voiceclone/clone', data)
  }
}

export default new VoiceCloneApi()
