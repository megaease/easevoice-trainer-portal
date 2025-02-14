import apiClient from '@/lib/apiClient'

class trainingApi {
  async startTraining(data: { source_dir: string }) {
    return await apiClient.post(`/easevoice/start`, data)
  }

  async getTrainingStatus() {
    return await apiClient.get(`/easevoice/status`)
  }

  async stopTraining() {
    return await apiClient.post(`/easevoice/stop`)
  }
}

export default new trainingApi()
