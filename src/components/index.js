// 注册全局组件
import Vue from 'vue'
import { AlertPlugin, ToastPlugin, WechatPlugin, ConfirmPlugin } from 'vux'
import xButton from '@c/layout/xButton'
import actionSheet from '@c/layout/actionSheet'
import pullUpUi from '@c/layout/pullUpUi'
import noDataShow from '@c/layout/noDataShow'

Vue.component('xButton', xButton) // 按钮
Vue.component('actionSheet', actionSheet)
Vue.component('pullUpUi', pullUpUi)
Vue.component('noDataShow', noDataShow)

Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(WechatPlugin)
Vue.use(ConfirmPlugin)

Vue.toast = Vue.prototype.$toast = function ({text, position = 'middle', type = 'text', width = '7.6em', callBack}) {
  this.$vux.toast.show({
    isShowMask: true,
    text: text,
    width: width,
    type: type, // 类型，可选值 success, warn, cancel, text
    position: position
  })
  if (callBack) {
    setTimeout(res => {
      callBack()
    }, 2000)
  }
}

// confirm
Vue.confirm = Vue.prototype.$confirm = function ({title, content, confirmBack, cancelBack = function () {}, confirmText = '确定', cancelText = '取消'}) {
  this.$vux.confirm.show({
    title: title,
    content: content,
    cancelText: cancelText,
    confirmText: confirmText,
    onConfirm () {
      confirmBack()
    },
    onCancel () {
      cancelBack()
    }
  })
}

// alert
Vue.alert = Vue.prototype.$alert = function ({title, content, confirmBack, confirmText = '确定'}) {
  this.$vux.alert.show({
    title: title,
    content: content,
    onHide () {
      confirmBack()
    }
  })
}




