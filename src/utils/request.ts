import axios from 'axios'
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import router from '@/router'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
})

/** 防止 401 时多个并发请求重复弹窗跳转 */
let isRedirecting = false

// 请求拦截器：统一携带 token
service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('tq_erp_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：统一处理业务码与错误
service.interceptors.response.use(
  (response) => {
    const res = response.data
    // 约定后端返回 { code, message, data }，code 为 0/200 视为成功
    if (res && typeof res === 'object' && 'code' in res && res.code !== 0 && res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      localStorage.removeItem('tq_erp_token')
      localStorage.removeItem('tq_erp_user')
      if (!isRedirecting) {
        isRedirecting = true
        ElMessage.warning('登录已过期，请重新登录')
        router.push('/login')
        setTimeout(() => {
          isRedirecting = false
        }, 1000)
      }
    } else {
      ElMessage.error(error.response?.data?.message || error.message || '网络异常，请稍后重试')
    }
    return Promise.reject(error)
  },
)

/** 通用请求方法（后端就绪后使用） */
export function request<T>(config: AxiosRequestConfig): Promise<T> {
  // 响应拦截器已解包 data，此处断言为业务数据类型
  return service.request(config) as Promise<T>
}

export default service
