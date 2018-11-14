import { request } from '../require.js'
// 课程列表接口
export const courseListApi = (data, needLoading) => {
  return request({
    url: '/course/courseList',
    type: 'post',
    data,
    needLoading: needLoading
  })
}
// 我的课程列表
export const myCourseListApi = (data, needLoading) => {
  return request({
    url: '/course/myCourse',
    type: 'post',
    data,
    needLoading: needLoading
  })
}
// 课程类别分类接口
export const categoryApi = (data) => {
  return request({
    url: '/category',
    type: 'get',
    data
  })
}
// 课程详情接口
export const courseInfoApi = (data) => {
  return request({
    url: '/course/courseInfo',
    type: 'post',
    data
  })
}
// 课节列表
export const CourseSectionApi = (data) => {
  return request({
    url: `/CourseSection?jsonData=${data.jsonData}&page=${data.page}&pageCount=${data.pageCount}`,
    type: 'get'
  })
}
// 课节详情
export const lessonDetailApi = (id) => {
  return request({
    url: `/CourseSection/${id}/edit`,
    type: 'get'
  })
}
// 课节打卡列表
export const getCourseCardListApi = (data) => {
  return request({
    url: `/CourseSectionCard?jsonData=${data.jsonData}&page=${data.page}&pageCount=${data.pageCount}&type=${data.type}`,
    type: 'get'
  })
}
// 加入课程
export const getCourseJoinApi = (data, needLoading) => {
  return request({
    url: `/course/courseJoin`,
    type: 'post',
    data,
    needLoading
  })
}
// 打卡或评论点赞
export const getFavorApi = (data, needLoading) => {
  return request({
    url: `/coursesectioncard/commonFavor/${data.sourceId}?sourceType=${data.sourceType}`,
    type: 'put',
    needLoading: needLoading
  })
}
// 打卡或评论取消点赞
export const delFavorApi = (data, needLoading) => {
  return request({
    url: `/coursesectioncard/commonFavor/${data.sourceId}?sourceType=${data.sourceType}`,
    type: 'delete',
    needLoading: needLoading
  })
}
// 课节打卡提交
export const postPunchCardApi = (data) => {
  return request({
    url: `/CourseSection/CourseSectionCard/setCourseSectionCard`,
    type: 'post',
    data
  })
}
// 课节打卡详情和打卡内容详情
export const getPunchCardDetailsApi = (data) => {
  return request({
    url: `/CourseSection/CourseSectionCard/getCourseSectionCardDetails?${data.name}=${data.id}`,
    type: 'get'
  })
}
// 上传图片
export const attachesApi = (data, config, changText) => {
  return request({
    url: `/attaches`,
    type: 'post',
    config,
    changText, // 修改loading文案
    data
  })
}
// 打卡点赞列表
export const getFavorListApi = (data) => {
  return request({
    url: `/coursesectioncard/commonFavorUsers/${data.sourceId}`,
    data,
    type: 'get'
  })
}
// 请求一级评论列表
export const getCommentListApi = (data, needLoading) => {
  return request({
    url: `/coursesectioncard/comment/commentList/${data.postId}`,
    type: 'get',
    data,
    needLoading: needLoading
  })
}
// 请求一级热门评论列表
export const getHotCommentListApi = (data, needLoading) => {
  return request({
    url: `/coursesectioncard/comment/hot/${data.postId}`,
    type: 'get',
    data,
    needLoading: needLoading
  })
}
// 评论打卡或回复评论
export const courseCardCommentApi = (data, needLoading) => {
  return request({
    url: `/coursesectioncard/commoneComment/${data.sourceId}`,
    type: 'put',
    data,
    needLoading: needLoading
  })
}
// 评论打卡或回复评论
export const getCommentDetailApi = (data) => {
  return request({
    url: `/coursesectioncard/comment/${data}`,
    type: 'get'
  })
}
// 评论打卡或回复评论
export const delCommentApi = (data) => {
  return request({
    url: `/coursesectioncard/comment/${data}`,
    type: 'delete'
  })
}
// 评论打卡或回复评论
export const getReplyListApi = (data, needLoading) => {
  return request({
    url: `/coursesectioncard/comment/replyList/${data.id}`,
    type: 'get',
    data,
    needLoading: needLoading
  })
}
// 评论打卡或回复评论
export const getCirclePeopleListApi = (data, needLoading) => {
  return request({
    url: `/CourseSection/getPeopleList/${data.id}`,
    type: 'get',
    data,
    needLoading: needLoading
  })
}
// 评论打卡或回复评论
export const setExcellentCourseCardApi = (data) => {
  return request({
    url: `/CourseSection/CourseSectionCard/setExcellentCourseCard`,
    data,
    type: 'post'
  })
}
// 导师端课程列表
export const getCourseTcApi = (data, needLoading) => {
  return request({
    url: `/course/myMasterCourse`,
    data,
    type: 'post',
    needLoading: needLoading
  })
}











