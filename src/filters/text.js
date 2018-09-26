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
