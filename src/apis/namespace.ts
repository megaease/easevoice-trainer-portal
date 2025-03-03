import apiClient from '@/lib/apiClient'

interface NamespaceRoot {
  'namespaces-root': string;
  setOnce: boolean;
}

interface UpdateNamespaceRoot {
  'namespaces-root': string;
}

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


  async getNamespaceRoot() {
    return await apiClient.get<NamespaceRoot>('/namespaces-root')
  }
  async updateNamespaceRoot(data: UpdateNamespaceRoot) {
    return await apiClient.post('/namespaces-root', data)
  }
}

export default new NamespaceApi()
