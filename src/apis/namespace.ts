import apiClient from '@/lib/apiClient'

class NamespaceApi {
  async getNamespaces() {
    return await apiClient.get('/namespaces')
  }

  async getNamespace(id: string) {
    return await apiClient.get(`/namespaces/${id}`)
  }

  async createNamespace(data: any) {
    return await apiClient.post('/namespaces', data)
  }

  async updateNamespace(id: string, data: any) {
    return await apiClient.put(`/namespaces/${id}`, data)
  }

  async deleteNamespace(name: string) {
    return await apiClient.delete(`/namespaces/${name}`)
  }
}

export default new NamespaceApi()
