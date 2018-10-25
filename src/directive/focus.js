import Vue from 'vue'
// 注册图片预览
Vue.directive('focus', {
  bind: function (el, binding, vnode) {
    if (binding.value === 'autoFocus') {
      // 自动获取焦点
      setTimeout(() => {
        el.focus()
      }, 100)
    }
    el.addEventListener('click', () => {
      // 强制输入框顶起
      setTimeout(() => {
        document.body.scrollTop = document.body.scrollHeight
      }, 100)
    })
  },
  inserted: function (e) {
  },
  update: function (el, binding, vnode) {
  },
  componentUpdated: function (e) {
  },
  unbind: function (e) {
  }
})