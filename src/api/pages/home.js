import { request } from '../require.js'

// 首页
export const getHomeInfoApi = (data) => {
  return request({
    type: 'get',
    url: `/user/home`,
    data,
    needLoading: true
  })
}


