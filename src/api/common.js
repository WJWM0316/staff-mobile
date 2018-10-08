// 通用接口api
import { request } from './require'

/**
 * 获取微信jssdk签名
 * @param {*} data
 */
export const getWechatSignApi = data => request({
  type: 'get',
  url: '/wechat/getWechatSign',
  data,
  needLoading: false
})

/**
 * 文件上传
 * @param {*} data
 */
export const uploadApi = (data, needLoading) => request({
  type: 'post',
  url: '/attaches/config',
  data,
  needLoading: needLoading
})
