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
/* 获取成员分组 */
export const getCircleClassfyApi = (data) => {
  return request({
    url: `/group`,
    type: 'get',
    data
  })
}
/* 置顶工作圈 */
export const putStickApi = (data) => {
  return request({
    url: `/jobcircle/stick?id=${data}`,
    type: 'put'
  })
}
/* 取消置顶工作圈 */
export const putNostickApi = (data) => {
  return request({
    url: `/jobcircle/nostick?id=${data}`,
    type: 'put'
  })
}
/* 关注工作圈 */
export const putFocusApi = (data) => {
  return request({
    url: `/jobcircle/focus?id=${data}`,
    type: 'put'
  })
}
/* 取消关注 */
export const putNoFocusApi = (data) => {
  return request({
    url: `/jobcircle/nofocus?id=${data}`,
    type: 'put'
  })
}
/* 圈主编辑工作圈封面和名字 */
export const putModifyApi = (data) => {
  return request({
    url: `/jobcircle/modify/${data.id}?name=${data.name}&cover_img_id=${data.cover_img_id}`,
    type: 'put'
  })
}