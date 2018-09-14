import {request} from '../require.js'
/* 获取工作圈全部列表   */
export const getJobcircleApi = (data) => {
  return request({
    url: '/jobcircle/all',
    type: 'get',
    data
  })
}
/* 获取工作圈全部列表   */
export const getAttentionsApi = (data) => {
  return request({
    url: '/jobcircle/attentions',
    type: 'get',
    data
  })
}
/* 获取工作圈全部列表   */
export const getCircleDetailApi = (id) => {
  return request({
    url: `/jobcircle/detail/${id}`,
    type: 'get'
  })
}
