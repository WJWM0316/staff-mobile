import { request } from '../require.js'

// 书籍列表
export const getBooksListApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: '/books',
    data,
    needLoading: needLoading
  })
}
// 我的书籍列表
export const getMyBooksListApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: '/books/myBooks',
    data,
    needLoading: needLoading
  })
}
// 书籍目录
export const getCatalogueApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: '/books/catalogue',
    data,
    needLoading: needLoading
  })
}
// 书籍详情
export const getBookInfoApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: '/books/bookInfo',
    data,
    needLoading: needLoading
  })
}
// 书籍内容
export const getContentApi = (data, needLoading) => {
  return request({
    type: 'post',
    url: '/books/bookContent',
    data,
    needLoading: needLoading
  })
}
// 书籍一级标签列表
export const getTagListApi = (data, needLoading) => {
  return request({
    type: 'get',
    url: '/books/tagList',
    data,
    needLoading: needLoading
  })
}
