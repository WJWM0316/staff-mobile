import { request } from '../require.js'

// 登录
export const loginApi = (data) => {
  return request({
    type: 'post',
    url: '/auth/login',
    data
  })
}
// 全局聚合登录
export const ssoLoginApi = (data) => {
  return request({
    type: 'post',
    url: '/unifyauth/login',
    data
  })
}
// 更新图片验证码
export const undataCodeApi = (data) => {
  return request({
    type: 'get',
    url: '/unifyauth/captcha',
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
// 微信绑定登录
export const bindWxLogin = (data, needLoading) => {
  return request({
    type: 'post',
    url: `/sso_login/bind/wechat`,
    data,
    needLoading: false
  })
}
// 微信解绑
export const unbindWxApi = (data, needLoading) => {
  return request({
    type: 'put',
    url: `/sso/wechat/unbind`,
    data,
    needLoading: false
  })
}
// sso token登录
export const tokenLogin = (data, needLoading) => {
  return request({
    type: 'post',
    url: `/auth/token`,
    data,
    needLoading: false
  })
}
