import axios from 'axios'

const service = axios.create({
  baseURL: process.env.NODE_ENV ==='production' ? import.meta.env.VITE_API_URL : "http://localhost:3000",
  timeout: 5000,
})

console.log(import.meta.env.VITE_API_URL)

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    const res = response.data
    if(res.code !== 200) {
      if(res.code === 888) {
        localStorage.removeItem('token')
        return Promise.reject(new Error('token expired'))
      }
        return Promise.reject(new Error(res.message || 'Error'))
    }
    return res
   
  },
  (error) => {
    return Promise.reject(error)
  }
)


export default service;