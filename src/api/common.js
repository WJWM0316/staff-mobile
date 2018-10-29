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
export const uploadApi = (data, config, needLoading) => request({
  type: 'post',
  url: '/attaches',
  data,
  config,
  needLoading: needLoading
})
/**
 * 获取文件上传配置
 * @param {*} data
 */
export const uploadFileApi = (data, config, needLoading) => request({
  type: 'post',
  url: '/attaches/config',
  data,
  config,
  needLoading: needLoading
})
/**
 * 微信上传
 * @param {*} data
 */
export const wxUploadFileApi = (data, needLoading) => request({
  type: 'post',
  url: '/wx/attaches',
  data,
  needLoading: needLoading
})
