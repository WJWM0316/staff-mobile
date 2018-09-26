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