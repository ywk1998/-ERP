import { defineStore } from 'pinia'
import { loginApi, getUserInfoApi } from '@/api/login'
import type { LoginParams, UserInfo } from '@/api/login'

const TOKEN_KEY = 'tq_erp_token'
const USER_KEY = 'tq_erp_user'

function loadUserInfo(): UserInfo | null {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null') as UserInfo | null
  } catch {
    return null
  }
}

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || '',
    userInfo: loadUserInfo(),
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    nickname: (state) => state.userInfo?.nickname || state.userInfo?.username || '',
  },

  actions: {
    /** 登录 */
    async login(params: LoginParams) {
      const result = await loginApi(params)
      this.token = result.token
      this.userInfo = result.userInfo
      localStorage.setItem(TOKEN_KEY, result.token)
      localStorage.setItem(USER_KEY, JSON.stringify(result.userInfo))
      return result
    },

    /** 获取用户信息（用于刷新页面后恢复） */
    async fetchUserInfo() {
      this.userInfo = await getUserInfoApi()
      localStorage.setItem(USER_KEY, JSON.stringify(this.userInfo))
      return this.userInfo
    },

    /** 退出登录 */
    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    },
  },
})
