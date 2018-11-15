import Vue from 'vue'
import wx from '@/mixins/wechat'
let list = [] // 预览图片列表
const preview = (el, binding, vnode) => {
  list = []
  // 绑定图片点击事件
  const bindClick = (element, img, urls) => {
    let bingFun = (e) => {
      let data = {
        img,
        urls
      }
      wx.methods.wechatPreviewImage(data)
      e.stopPropagation() // 防止事件冒泡
    }
    // 已绑定的不在重新绑定
    if (!element.getAttribute('binded')) {
      element.setAttribute('binded', true)
      element.addEventListener('click', bingFun)
    }
  }
  // 遍历图片获取列表+绑定
  const findImg = (element) => {
    let HTMLCollection = element.getElementsByTagName('img')
    let list = []
    for (let i = 0; i < HTMLCollection.length; i++) {
      let dataSrc = HTMLCollection[i].getAttribute('data-src')
      if (dataSrc) {
        list.push(dataSrc)
        bindClick(HTMLCollection[i], dataSrc, list)
      }
    }
  }
  if (el.nodeName === 'IMG') {
    list.push(el.dataset.src)
    bindClick(el, el.dataset.src, list)
  } else {
    findImg(el)
  }
}
// 注册图片预览
let timer = null
Vue.directive('preview', {
  bind: function (el, binding, vnode) {
    preview(el, binding, vnode)
  },
  inserted: function (el) {
  },
  update: function (el, binding, vnode) {
  },
  componentUpdated: function (el, binding, vnode) {
    preview(el, binding, vnode)
  },
  unbind: function (e) {
  }
})
