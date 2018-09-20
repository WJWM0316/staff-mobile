
import Vue from 'vue'
import router from '@/router/index'
import './components'
// import './util/flexible'
import './util/flexible'
import App from './App'
import store from './store/'


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
