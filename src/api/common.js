// 通用接口api
import { request } from './require'

/**
 * 获取上传配置信息
 * @param {*} data { file_type } file_type：image:图片,audio:音频,video:视频,file:文件
 */
export const getUploadFileConfig = data => request({
  url: '/wx/currency/getUploadFileConfig',
  needLoading: false,
  data
})

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
 * 微信上传
 * @param {*} data
 */
export const wechatUploadFileApi = data => request({
  url: '/wap/currency/wxUploadFile',
  data
})
