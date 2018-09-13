import { request } from '../require.js'
// 登录
export const loginApi = (data) => {
  return request({
    url: '/auth/login',
    data,
    isLoading: true
  })
}