import Vue from 'vue'
import wx from '@/mixins/wechat'
let bingFun = null
let allList = []
const preview = (el, binding, vnode) => {
  let list = []
  // 绑定图片点击事件
  const bindClick = (element, img) => {
    bingFun = (e) => {
      let data = {}
      if (binding.value === 'allList') {
        data = {
          img,
          urls: allList
        }
      } else {
        data = {
          img,
          urls: list
        }
      }
      wx.methods.wechatPreviewImage(data)
      e.stopPropagation() // 防止事件冒泡
    }
    // 已绑定的不在重新绑定
    if (!element.getAttribute('binded')) {
      element.setAttribute('binded', true)
      element.addEventListener('click', bingFun)
    } else {
      element.removeEventListener('click', bingFun, false)
      // element.addEventListener('click', bingFun, false)
    }
  }
  // 遍历图片获取列表+绑定
  const findImg = (element) => {
    let HTMLCollection = element.getElementsByTagName('img')
    // 先遍历获取list再一个个绑定
    for (let i = 0; i < HTMLCollection.length; i++) {
      if (binding.value === 'richText') {
        let dataSrc = HTMLCollection[i].getAttribute('src')
        list.push(dataSrc)
      } else {
        let dataSrc = HTMLCollection[i].getAttribute('data-src')
        if (dataSrc) {
          if (binding.value === 'allList') {
            allList.push(dataSrc)
          } else {
            list.push(dataSrc)
          }
        }
      }
    }
    for (let i = 0; i < HTMLCollection.length; i++) {
      if (binding.value === 'richText') {
        let dataSrc = HTMLCollection[i].getAttribute('src')
        if (dataSrc) {
          bindClick(HTMLCollection[i], dataSrc)
        }
      } else {
        let dataSrc = HTMLCollection[i].getAttribute('data-src')
        if (dataSrc) {
          bindClick(HTMLCollection[i], dataSrc)
        }
      }
    }
  }
  if (el.nodeName === 'IMG') {
    if (el.dataset.dataSrc) {
      list.push(el.dataset.dataSrc)
      list = [el.dataset.dataSrc]
    } else {
      list.push(el.dataset.src)
      list = [el.dataset.src]
    }
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
    allList = []
    preview(el, binding, vnode)
  },
  unbind: function (e) {
  }
})
