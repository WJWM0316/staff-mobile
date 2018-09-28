import { request } from '../require.js'
// 社区基本信息
export const getCommunityApi = (data) => {
  return request({
    url: '/wap/beacon/community',
    data,
    isLoading: true
  })
}
// 课程列表接口
export const courseListApi = (data) => {
  return request({
    url: '/course/courseList',
    type: 'post',
    data
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
    url: `/CourseSectionCard?jsonData=${data.jsonData}&page=${data.page}&pageCount=${data.pageCount}`,
    type: 'get'
  })
}
// 加入课程
export const getCourseJoinApi = (data) => {
  return request({
    url: `/course/courseJoin`,
    type: 'post',
    data
  })
}
// 打卡点赞
export const getPunchFavorApi = (data) => {
  return request({
    url: `/coursesectioncard/favor/post/${data}`,
    type: 'put'
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
export const attachesApi = (data, config) => {
  return request({
    url: `/attaches`,
    type: 'post',
    config,
    data
  })
}







