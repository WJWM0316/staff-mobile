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
  url: '/attaches',
  data,
  needLoading: needLoading
})
/**
 * 文件删除
 * @param {*} data
 */
export const removeFileApi = (data, needLoading) => request({
  type: 'delete',
  url: `/attaches/${data.id}`,
  data,
  needLoading: needLoading
})
/**
 * 获取文件上传配置
 * @param {*} data
 */
export const uploadFileApi = (data, needLoading) => request({
  type: 'post',
  url: '/attaches/config',
  data,
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
