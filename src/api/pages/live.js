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

// 获取分类列表
export const getCategoryApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: `/category`,
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
    url: `/live/memberList/${data.id}`,
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
// 获取导师问答列表
export const getAnswerListApi = (data, needLoading) => {
  return request({
    type: 'post',
    url: `/live/masterProblemList`,
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
// 导师回答
export const putAnswerApi = (data, needLoading) => {
  return request({
    type: 'post',
    url: `/live/addAnswer`,
    data,
    needLoading: needLoading
  })
}
// 发布直播消息
export const sendLiveMsgApi = (data, needLoading) => {
  return request({
    type: 'post',
    url: `/liveMessage/sendLiveMsg`,
    data,
    needLoading: needLoading
  })
}

// 直播红点消除
export const removeRedApi = (data, needLoading) => {
  return request({
    type: 'post',
    url: `/liveMessage/delMessageRed`,
    data,
    needLoading: false
  })
}
// 直播消息记录
export const msgPositionApi = (data, needLoading) => {
  return request({
    type: 'post',
    url: `/liveMessage/positionMessage`,
    data,
    needLoading: false
  })
}
// 直播音频听完
export const endAudioApi = (data, needLoading) => {
  return request({
    type: 'post',
    url: `/liveMessage/setMessageComplete`,
    data,
    needLoading: false
  })
}
// 结束直播
export const putUpdataLiveApi = (data, needLoading) => {
  return request({
    type: 'put',
    url: `/live/update/${data.liveId}`,
    data,
    needLoading: false
  })
}
// 导师端获取直播列表
export const getTutorLiveApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: `/live/tutorLive`,
    data,
    needLoading: needLoading
  })
}

