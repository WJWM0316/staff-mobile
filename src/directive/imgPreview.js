import Vue from 'vue'
import wx from '@/mixins/wechat'
let list = [] // 预览图片列表
const preview = (el, binding, vnode) => {
  list = []
  // 绑定图片点击事件
  const bindClick = (element, img, urls) => {
    element.addEventListener('click', (e) => {
      let data = {
        img,
        urls
      }
      wx.methods.wechatPreviewImage(data)
      e.stopPropagation() // 防止事件冒泡
    })
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
Vue.directive('preview', {
  bind: function (el, binding, vnode) {
    console.log(11111)
    preview(el, binding, vnode)
  },
  inserted: function (el) {
    console.log(444)
  },
  update: function (el, binding, vnode) {
    console.log(222222222222222)
    // preview(el, binding, vnode)
  },
  componentUpdated: function (el, binding, vnode) {
    preview(el, binding, vnode)
  },
  unbind: function (e) {
  }
})
