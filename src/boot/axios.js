import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Base URL sesuai yang Anda berikan
const api = axios.create({ baseURL: 'https://edulang-be.vercel.app/api' })

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }