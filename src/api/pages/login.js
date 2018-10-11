import { request } from '../require.js'

// 登录
export const loginApi = (data) => {
  return request({
    type: 'post',
    url: '/auth/login',
    data
  })
}
// 退出登录
export const outLoginApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: `/auth/logout`,
    data,
    needLoading: needLoading
  })
}
// 修改密码
export const resetPwdApi = (data, needLoading) => {
  return request({
    type: 'post',
    url: `/user/editPwd`,
    data,
    needLoading: needLoading
  })
}