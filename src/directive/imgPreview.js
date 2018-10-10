import Vue from 'vue'
import wx from '@/mixins/wechat'
import router from '@/router/index'
// 注册图片预览
Vue.directive('preview', {
  bind: function (el, binding, vnode) {
    if (!el.getAttribute('data-preview')) return
    let list = []
    // 绑定图片点击事件
    const bindClick = (element, img, urls) => {
      element.addEventListener('click', () => {
        let data = {
          img,
          urls
        }
        wx.methods.wechatPreviewImage(data)
      })
    }
    // 遍历图片获取列表+绑定
    const findImg = (element) => {
      element.children.forEach(e => {
        if (e.tag === 'img') {
          list.push(e.data.attrs.src)
          bindClick(e.elm, e.data.attrs.src, list)
        } else {
          if (e.children.length > 0) {
            findImg(e)
          }
        }
      })
    }
    if (vnode.tag === 'img') {
      list.push(vnode.data.attrs.src)
      bindClick(el, vnode.data.attrs.src, list)
    } else {
      findImg(vnode)
    }
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