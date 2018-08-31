import { request } from '../require'

// 写下说明
export const getInformationApi = data => request({
  url: '/wap/my/getInformation',
  data
})