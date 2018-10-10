
import Vue from 'vue'
import router from '@/router/index'
import './components'
import './filters'
import './directive'
import './util/flexible'
import App from './App'
import store from './store/'
import wx from 'weixin-js-sdk'
import LazyLoad from './util/imgLazyload/lazyload'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
Vue.use(LazyLoad)
Vue.prototype.$wechat = wx
Vue.wx = wx

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')