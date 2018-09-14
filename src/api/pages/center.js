import { request } from '../require'

// 获取用户信息
export const userInfoApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: '/cur/user_info',
    data,
    needLoading: needLoading
  })
}