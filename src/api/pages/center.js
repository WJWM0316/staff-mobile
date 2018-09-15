import { request } from '../require.js'

// 获取当前用户信息
export const userInfoApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: '/cur/user_info',
    data,
    needLoading: needLoading
  })
}