// 注册全局组件
import Vue from 'vue'
import { AlertPlugin, ToastPlugin, WechatPlugin, ConfirmPlugin } from 'vux'
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(WechatPlugin)
Vue.use(ConfirmPlugin)


Vue.prototype.$toast = function ({text, position = 'bottom', type = 'text', callBack}) {
  this.$vux.toast.show({
    isShowMask: true,
    text: text,
    type: type,
    position: 'middle'
  })
  if (callBack) {
    setTimeout(res => {
      callBack()
    }, 2000)
  }
}

// confirm
Vue.prototype.$confirm = function ({title, content, confirmBack, cancelBack, cancelText = '取消', confirmText = '确定'}) {
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
Vue.prototype.$alert = function ({title, content, confirmBack, confirmText = '确定'}) {
  this.$vux.alert.show({
    title: title,
    content: content,
    onHide () {
      confirmBack()
    }
  })
}




