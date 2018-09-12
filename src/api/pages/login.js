import { request } from '../require.js'
// 登录
export const getCommunityApi = (data) => {
  return request({
    url: '/wap/beacon/community',
    data,
    isLoading: true
  })
}