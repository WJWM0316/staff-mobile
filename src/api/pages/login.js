import { request } from '../require.js'

// 登录
export const loginApi = (data) => {
  return request({
    type: 'post',
    url: '/auth/login',
    data
  })
}