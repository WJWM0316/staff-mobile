import Vue from 'vue'
// 注册图片预览
Vue.directive('focus', {
  bind: function (el, binding, vnode) {
    el.addEventListener('click', () => {
      // 强制输入框顶起
      setTimeout(() => {
        document.body.scrollTop = document.body.scrollHeight
      }, 100)
    })
  },
  inserted: function (e) {
  },
  update: function (e) {
  },
  componentUpdated: function (e) {
  },
  unbind: function (e) {
  }
})