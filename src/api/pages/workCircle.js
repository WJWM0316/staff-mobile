import {request} from '../require.js'
/* 获取工作圈全部列表   */
export const getJobcircleApi = (data, needLoading) => {
  return request({
    url: `/jobcircle/all`,
    type: 'get',
    data: data,
    needLoading: needLoading
  })
}
/* 获取工作圈关注列表   */
export const getAttentionsApi = (data, needLoading) => {
  return request({
    url: `/jobcircle/attentions`,
    type: 'get',
    data: data,
    needLoading: needLoading
  })
}
/* 获取工作圈全部列表   */
export const getCircleDetailApi = (data) => {
  return request({
    url: `/jobcircle/detail/${data}`,
    type: 'get',
    data: data
  })
}
/* 获取成员分组 */
export const getCircleClassfyApi = (data) => {
  return request({
    url: `/group`,
    type: 'get',
    data: data
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
    url: `/jobcircle/modify/${data.id}?name=${data.name}`,
    type: 'put'
  })
}
/* 获取帖子列表 */
export const getPostlistApi = (data, needLoading) => {
  return request({
    url: `/jobcircle/postlist/${data.id}`,
    type: 'get',
    data: data,
    needLoading: needLoading
  })
}
/* 工作圈发帖 */
export const jobcirclePostApi = (data) => {
  return request({
    url: `/jobcircle/post`,
    type: 'post',
    data: data
  })
}
/* 帖子详情 */
export const postDetailApi = (data) => {
  return request({
    url: `/jobcircle/post/${data}`,
    type: 'get',
    data: data
  })
}
/* 一级评论列表 */
export const firstCommentListlApi = (data) => {
  return request({
    url: `/jobcircle/comment/commentList/${data.id}}`,
    type: 'get',
    data: data
  })
}
/* 评论工作圈帖子 */
export const circleCommentApi = (data) => {
  return request({
    url: `/jobcircle/commoneComment/${data.sourceId}`,
    type: 'put',
    data: data
  })
}
/* 帖子详情点赞列表 */
export const commonFavorListApi = (data) => {
  return request({
    url: `/jobcircle/commonFavorUsers/${data.sourceId}`,
    type: 'get',
    data: data
  })
}
/* 点赞评论或帖子 */
export const circleCommonFavorApi = (data, needLoading) => {
  return request({
    url: `/jobcircle/commonFavor/${data.sourceId}?sourceType=${data.circleSourceType}`,
    type: 'put',
    needLoading: needLoading
  })
}
/* 评论或帖子取消点赞 */
export const delCircleCommonFavorApi = (data, needLoading) => {
  return request({
    url: `/jobcircle/commonFavor/${data.sourceId}?sourceType=${data.circleSourceType}`,
    type: 'delete',
    needLoading: needLoading
  })
}
/* 删除评论 */
export const delCircleCommentApi = (data) => {
  return request({
    url: `/jobcircle/comment/${data}`,
    type: 'delete',
    data: data,
    needLoading: true
  })
}
/* 删除工作圈帖子 */
export const delCirclePostApi = (data) => {
  return request({
    url: `/jobcircle/post/${data}`,
    type: 'delete',
    data: data,
    needLoading: true
  })
}
/* 工作圈成员列表 */
export const circleMemberListApi = (data) => {
  return request({
    url: `/jobcircle/members/${data.id}`,
    type: 'get',
    data: data,
    needLoading: true
  })
}
/* 圈主信息 */
export const circleTutorInfoApi = (data) => {
  return request({
    url: `/jobcircle/owner/${data.id}`,
    type: 'get',
    data: data,
    needLoading: true
  })
}
/* 工作圈帖子置顶 */
export const circlePostToTopApi = (data) => {
  return request({
    url: `/jobcircle/post/stick`,
    type: 'put',
    data: data,
    needLoading: true
  })
}
/* 工作圈帖子取消置顶 */
export const delCirclePostToTopApi = (data) => {
  return request({
    url: `/jobcircle/post/nostick`,
    type: 'put',
    data: data,
    needLoading: true
  })
}
/* 获取图片月份列表 */
export const getPicturemonthApi = (data) => {
  return request({
    url: `/jobcircle/picturemonth/${data}`,
    type: 'get',
    data: data,
    needLoading: true
  })
}
/* 获取月份图片 */
export const getPictureApi = (data, needLoading) => {
  return request({
    url: `/jobcircle/picture/${data.id}`,
    type: 'get',
    data: data,
    needLoading: true
  })
}
/* 获取圈子最近的上传文件 */
export const getFilesApi = (data, needLoading) => {
  return request({
    url: `/jobcircle/files/${data.id}`,
    type: 'get',
    data: data,
    needLoading: true
  })
}
/* 获取圈子最近的帖子链接 */
export const getUrlsApi = (data, needLoading) => {
  return request({
    url: `/jobcircle/urls/${data.id}?page=${data.page}&count=${data.count}`,
    type: 'get',
    data: data,
    needLoading: needLoading
  })
}
/* 获取一条一级评论 */
export const getCircleCommentDetailApi = (data) => {
  return request({
    url: `/jobcircle/comment/${data}`,
    type: 'get'
  })
}
/* 获取二级评论列表 */
export const getCircleCommentListlApi = (data) => {
  return request({
    url: `/jobcircle/comment/replyList/${data.id}`,
    data,
    type: 'get'
  })
}
/* 删除工作圈帖子 */
export const delPostApi = (id) => {
  return request({
    url: `/jobcircle/post/${id}`,
    type: 'delete'
  })
}
/* 获取工作圈帖子热门评论列表 */
export const getHotCommentListApi = (data) => {
  return request({
    url: `/jobcircle/comment/hot/${data.id}?count=${data.count}`,
    type: 'get'
  })
}