import apiClient from '@/lib/apiClient'

class SessionApi {
  async getSessionInfo() {
    return await apiClient.get('/session')
  }
}

export default new SessionApi()
