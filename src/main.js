
import Vue from 'vue'
import router from '@/router/index'
import './components'
import './filters'
import './util/flexible'
import App from './App'
import store from './store/'
import wx from 'weixin-js-sdk'
import LazyLoad from '@u/imgLazyLoad/lazyLoad.js'
Vue.use(LazyLoad)
Vue.prototype.$wechat = wx
Vue.wechat = wx

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
