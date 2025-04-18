import axios, { AxiosInstance } from 'axios'
import axiosRetry, { IAxiosRetryConfig } from 'axios-retry'

const retries = 3
const isProd = import.meta.env.PROD

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const apiClient: AxiosInstance = axios.create({
  baseURL: isProd ? VITE_API_BASE_URL : '/api',
  timeout: 0,
})

const retryConfig: IAxiosRetryConfig = {
  retries,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error)
  },
}

axiosRetry(apiClient, retryConfig)

apiClient.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`
    // }
    // TODO
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
