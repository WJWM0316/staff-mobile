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
/* 获取帖子列表 */
export const getPostlistApi = (data) => {
  return request({
    url: `/jobcircle/postlist/${data.id}?page=${data.page}&sort=${data.sort}`,
    type: 'get'
  })
}
/* 工作圈发帖 */
export const jobcirclePostApi = (data) => {
  return request({
    url: `/jobcircle/post`,
    type: 'post',
    data
  })
}
/* 帖子详情 */
export const postDetailApi = (data) => {
  return request({
    url: `/jobcircle/post/${data}`,
    type: 'get',
    data
  })
}
/* 一级评论列表 */
export const firstCommentListlApi = (data) => {
  return request({
    url: `/jobcircle/comment/commentList/${data.id}?page=${data.page}&count=${data.count}`,
    type: 'get'
  })
}
/* 评论工作圈帖子 */
export const circleCommentApi = (data) => {
  return request({
    url: `/jobcircle/commoneComment/${data.sourceId}?sourceType=${data.sourceType}&content=${data.content}`,
    type: 'put'
  })
}
/* 帖子详情点赞列表 */
export const commonFavorListApi = (data) => {
  return request({
    url: `/jobcircle/commonFavorUsers/${data.sourceId}?sourceType=${data.sourceType}&page=${data.page}`,
    type: 'get'
  })
}
/* 点赞评论或帖子 */
export const circleCommonFavorApi = (data) => {
  return request({
    url: `/jobcircle/commonFavor/${data.sourceId}?sourceType=${data.circleSourceType}`,
    type: 'put'
  })
}
/* 评论或帖子取消点赞 */
export const delCircleCommonFavorApi = (data) => {
  return request({
    url: `/jobcircle/commonFavor/${data.sourceId}?sourceType=${data.circleSourceType}`,
    type: 'delete'
  })
}
/* 删除评论 */
export const delCircleCommentApi = (data) => {
  return request({
    url: `/jobcircle/comment/${data}`,
    type: 'delete'
  })
}
/* 删除工作圈帖子 */
export const delCirclePostApi = (data) => {
  return request({
    url: `/jobcircle/post/${data}`,
    type: 'delete'
  })
}
/* 工作圈成员列表 */
export const circleMemberListApi = (data) => {
  return request({
    url: `/jobcircle/members/${data.id}?page=${data.page}&count=${data.count}`,
    type: 'get'
  })
}
/* 圈主信息 */
export const circleTutorInfoApi = (data) => {
  return request({
    url: `/jobcircle/owner/${data.id}`,
    type: 'get'
  })
}
/* 工作圈帖子置顶 */
export const circlePostToTopApi = (data) => {
  return request({
    url: `/jobcircle/post/stick?id=${data}`,
    type: 'put'
  })
}
/* 工作圈帖子取消置顶 */
export const delCirclePostToTopApi = (data) => {
  return request({
    url: `/jobcircle/post/nostick?id=${data}`,
    type: 'put'
  })
}
