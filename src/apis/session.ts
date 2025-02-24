import apiClient from '@/lib/apiClient'

class SessionApi {
  async getSessionInfo() {
    return await apiClient.get('/session')
  }
  async getCurrentSession() {
    return await apiClient.get('/session/current')
  }
}

export default new SessionApi()
