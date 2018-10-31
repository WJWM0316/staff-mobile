import Vue from 'vue'
import wx from '@/mixins/wechat'
import router from '@/router/index'
// 注册图片预览
Vue.directive('preview', {
  bind: function (el, binding, vnode) {
  },
  inserted: function (el) {
  },
  update: function (el) {
  },
  componentUpdated: function (el, binding, vnode) {
    if (!binding.value) return
    let list = []
    // 绑定图片点击事件
    const bindClick = (element, img, urls) => {
      element.addEventListener('click', () => {
        console.log(binding.value, '点击啦')
        let data = {
          img,
          urls
        }
        wx.methods.wechatPreviewImage(data)
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
  },
  unbind: function (e) {
  }
})