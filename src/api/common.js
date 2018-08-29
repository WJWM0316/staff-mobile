// 通用接口api
import { request, upload } from './require'

// 获取个人详情
export const personalDetailsApi = (data) => {
  return request({
    url: '/wx/my/personalDetails',
    data,
    isLoading: true
  })
}

/**
 * 获取通用列表（行业列表，融资列表，工作年限列表等等）
 * @param {*} data { type } tpye: 列表类型（1行业，2融资，3自客工作年限，4内容分类，5全职工作年限，6年薪范围，7学历范围，8职位亮点，9公司规模）
 */
export const getGeneralListApi = data => request({
  url: '/wx/currency/getGeneralList',
  data
})

/**
 * 获取上传配置信息
 * @param {*} data { file_type } file_type：image:图片,audio:音频,video:视频,file:文件
 */
export const getUploadFileConfig = data => request({
  url: '/wx/currency/getUploadFileConfig',
  isLoading: false,
  data
})

/**
 * 上传文件到oss服务器
 * @param {*} filePath 微信临时文件路径，只能是一个
 * @param {*} data oss上传配置对象集
 */
// export const uploadFileToOSS = (filePath, data, setting) => {
//   console.log('filePath', filePath)
//   const { ossConfig, systemConfig } = data
//   return upload({
//     url: ossConfig.host,
//     data: {
//       key: `${ossConfig.dir}${systemConfig.fileName}.${systemConfig.suffix}`,
//       policy: ossConfig.policy,
//       OSSAccessKeyId: ossConfig.accessid,
//       success_action_status: '200',
//       callback: ossConfig.callback,
//       signature: ossConfig.signature,
//     },
//     filePath,
//     setting
//   })
// }

/**
 * 获取微信jssdk签名
 * @param {*} data
 */
export const getWechatSignApi = data => request({
  url: '/wap/currency/getWxSign',
  data,
  isLoading: false
})

/**
 * 微信上传
 * @param {*} data
 */
export const wechatUploadFileApi = data => request({
  url: '/wap/currency/wxUploadFile',
  data
})
