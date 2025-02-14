import apiClient from '@/lib/apiClient'

class trainingApi {
  async startTraining() {
    return await apiClient.post(`/easevoice/start`)
  }

  async getTrainingStatus() {
    return await apiClient.get(`/easevoice/status`)
  }

  async stopTraining() {
    return await apiClient.post(`/easevoice/stop`)
  }
}

export default new trainingApi()
