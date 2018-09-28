import { request } from '../require.js'
// 获取直播间信息
export const getLiveRoomMsgApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: `/live/messageList/${data.id}`,
    data,
    needLoading: needLoading
  })
}

// 获取直播详情
export const getLiveDetailApi = (data) => {
  return request({
    type: 'get',
    url: `/live/info/${data.id}`,
    data,
    needLoading: true
  })
}

// 加入直播间
export const joinLiveApi = (data) => {
  return request({
    type: 'get',
    url: `/live/join/${data.id}`,
    data,
    needLoading: true
  })
}

// 获取已加入直播列表
export const getJoinListApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: `/live/joinList`,
    data,
    needLoading: needLoading
  })
}

// 获取近期直播列表
export const getRecentListApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: `/live/recent`,
    data,
    needLoading: needLoading
  })
}

// 获取直播回顾列表
export const getEndListApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: `/live/end`,
    data,
    needLoading: needLoading
  })
}

// 获取直播成员列表
export const getMemberListApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: `/live/problemList/${data.id}`,
    data,
    needLoading: needLoading
  })
}

// 获取直播成员列表
export const getTeacherListApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: `/live/tutor/${data.id}`,
    data,
    needLoading: needLoading
  })
}

// 获取问答列表
export const getProblemListApi = (data, needLoading) => {
  return request({
    type: 'post',
    url: `/live/problemList`,
    data,
    needLoading: needLoading
  })
}

// 提问
export const putQuestionsApi = (data, needLoading) => {
  return request({
    type: 'post',
    url: `/live/addProblem`,
    data,
    needLoading: needLoading
  })
}





