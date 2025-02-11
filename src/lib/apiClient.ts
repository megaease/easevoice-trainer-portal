import axios, { AxiosInstance } from 'axios'

const isProd = import.meta.env.PROD;

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient: AxiosInstance = axios.create({
  baseURL: isProd ? VITE_API_BASE_URL + "/v1" : "/api",
  timeout: 10000,
});



apiClient.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`
    // }
    config.headers['Ease-Service'] = 'easevoice-trainer'
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default apiClient
