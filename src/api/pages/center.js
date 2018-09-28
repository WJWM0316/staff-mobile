import { request } from '../require.js'

// 获取当前用户信息
export const userInfoApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: '/my/info',
    data,
    needLoading: needLoading
  })
}

// 获取用户信息
export const getUserInfoApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: `/user/${data.id}/info`,
    data,
    needLoading: needLoading
  })
}

