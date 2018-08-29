import {request} from '../../api/require.js'

export const weixinApi = (data) => {
  return request({
    url: '/wap/currency/getWxSign',
    data
  })
}
