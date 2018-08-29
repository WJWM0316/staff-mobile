import Vue from 'vue'
import Router from 'vue-router'
// 引入模块路由

import store from './../store'

Vue.use(Router)

const routes = [
]

const router = new Router({
  // mode: 'history',
  base: '/beaconweb/',
  routes
})

router.beforeEach(async (to, from, next) => {
  // 控制导航条是否显示
  if (to.matched.some(record => record.meta.navHide)) {
    store.dispatch('hide_nav')
  } else {
    store.dispatch('show_nav')
  }
  next() // 确保一定要调用 next()
})
//
router.afterEach(function (to, from) {
})

// 全局路由生命周期
export default router
