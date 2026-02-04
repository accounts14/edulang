// src/boot/axios.js
import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://edulang-be.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Optional: intercept request untuk debug
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  console.log('[REQ]', config.method.toUpperCase(), config.url, config.data)
  return config
})

api.interceptors.response.use(
  (response) => {
    console.log('[RES]', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('[ERR]', error.response?.status, error.config.url, error.response?.data)
    return Promise.reject(error)
  },
)

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
