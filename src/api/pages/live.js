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