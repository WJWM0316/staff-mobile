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
    url: `/user/${data.uid}/info`,
    data,
    needLoading: needLoading
  })
}
// 导师端获取导师的基本信息
export const getTutorInfoApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: `/tutor/info`,
    data,
    needLoading: needLoading
  })
}
// 编辑用户信息
export const editUserInfoApi = (data, needLoading) => {
  return request({
    type: 'post',
    url: `/user/editBasic`,
    data,
    needLoading: needLoading
  })
}
// 获取当前用户的已加入列表
export const getMyJoinedListApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: `/my/joins`,
    data,
    needLoading: needLoading
  })
}
// 获取用户的已加入列表
export const getUserJoinedListApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: `/user/${data.uid}/joins`,
    data,
    needLoading: needLoading
  })
}

// 获取当前用户的帖子列表
export const getMyPostListApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: `/my/posts`,
    data,
    needLoading: needLoading
  })
}
// 获取用户的帖子列表
export const getUserPostListApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: `/user/${data.uid}/posts`,
    data,
    needLoading: needLoading
  })
}

// Ta的课程
export const getTaCourseApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: `/user/${data.uid}/lessons`,
    data,
    needLoading: needLoading
  })
}
// Ta的直播
export const getTaLiveApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: `/user/${data.uid}/lives`,
    data,
    needLoading: needLoading
  })
}
// 消息通知列表
export const getMessageListApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: `/my/notes`,
    data,
    needLoading: needLoading
  })
}
// 消息通知列表红点清除
export const putRedListApi = (data, needLoading) => {
  return request({
    type: 'put',
    url: `/my/note/read`,
    data,
    needLoading: needLoading
  })
}

