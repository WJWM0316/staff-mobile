// ======== 文本相关过滤器 ========

import Vue from 'vue'

/**
 * 换行符转换br标签
 * @param reverse 是否反向转换（将br标签转换成换行符），默认false
 */
Vue.filter('transformBr', (value, reverse = false) => {
  if (!value) {
    return ''
  }
  value = value.toString()
  return reverse
    ? value.replace(/<br\s*\/?>/g, '\n').replace(/&nbsp;/g, ' ')
    : value.replace(/\n\s*\r/g, '<br/>').replace(/\n/g, '<br/>').replace(/\r/g, '<br/>').replace(/\s/g, '&nbsp;')
})

// 根据字节为单位计算， 一个汉字等于2个字节
Vue.filter('ellipsis', (value, byteNum) => {
  if (!value) {
    return value
  }
  // 计算文本字节
  function pointOut (string, num) {
    let result = string.length
    let length = 0
    let regex = /^[\u4E00-\u9FA5]/
    for (var i = 0; i < string.length; i++) {
      // 检查双字节
      if (regex.test(string[i])) {
        length += 2
      } else {
        length += 1
      }
      if (length > num) { // 判断是否超过 是否需要打点
        result = i
        return result
      }
    }
    return result
  }
  let lineNum = pointOut(value, byteNum)
  if (lineNum !== value.length) {
    value = value.slice(0, lineNum) + '...'
  }
  return value
})

// 返回文件的类型封面 value 是文件的后缀
Vue.filter('fileCover', (value) => {
  if (!value) {
    return ''
  }
  if (value === 'doc' || value === 'docx') {
    return '/static/suffix/word.png'
  } else if (value === 'xls' || value === 'xlsx') {
    return '/static/suffix/xls.png'
  } else if (value === 'ppt') {
    return '/static/suffix/ppt.png'
  } else if (value === 'pdf') {
    return '/static/suffix/pdf.png'
  }
})