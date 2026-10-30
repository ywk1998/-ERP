// import service from '@/utils/request'

export interface LoginParams {
  username: string
  password: string
}

export interface UserInfo {
  username: string
  nickname: string
  roles: string[]
}

export interface LoginResult {
  token: string
  userInfo: UserInfo
}

/**
 * 登录接口（当前为 Mock 实现，后端就绪后替换为：
 *   export function loginApi(data: LoginParams) {
 *     return service.post<LoginResult>('/auth/login', data)
 *   }
 */
const MOCK_ACCOUNT = { username: 'admin', password: '123456' }

export function loginApi(data: LoginParams): Promise<LoginResult> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (data.username === MOCK_ACCOUNT.username && data.password === MOCK_ACCOUNT.password) {
        resolve({
          token: `mock-token-${Date.now()}`,
          userInfo: {
            username: 'admin',
            nickname: '系统管理员',
            roles: ['admin'],
          },
        })
      } else {
        reject(new Error('用户名或密码错误'))
      }
    }, 600)
  })
}

/** 获取当前用户信息（Mock） */
export function getUserInfoApi(): Promise<UserInfo> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        username: 'admin',
        nickname: '系统管理员',
        roles: ['admin'],
      })
    }, 300)
  })
}
