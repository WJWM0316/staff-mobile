import { request } from '../require.js'
// 社区基本信息
export const getLiveRoomMsgApi = (data) => {
  return request({
    type: 'get',
    url: `/live/messageList/${data.id}`,
    data,
    isLoading: true
  })
}