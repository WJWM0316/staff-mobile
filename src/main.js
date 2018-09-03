
import Vue from 'vue'
import router from '@/router/index'
import './components'
import './util/lib-flexible/flexible'
// import './util/lib-flexible/flexible'
import App from './App'
import store from './store/'


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
