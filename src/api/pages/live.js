import { request } from '../require.js'
// 获取直播间信息
export const getLiveRoomMsgApi = (data) => {
  return request({
    type: 'get',
    url: `/live/messageList/${data.id}`,
    data,
    isLoading: true
  })
}

// 获取直播详情
export const getLiveDetailApi = (data) => {
  return request({
    type: 'get',
    url: `/live/info/${data.id}`,
    data,
    isLoading: true
  })
}