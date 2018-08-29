
import Vue from 'vue'
import router from '@/router/index'
import './components' // 全局组件
import App from './App'
import store from './store/'


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
