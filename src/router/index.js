import Vue from 'vue'
import Router from 'vue-router'
// 引入路由模块
import home from './home'
import course from './course'
import workCircle from './workCircle'
import center from './center'
import live from './live'
import bookHouse from './bookHouse'
import login from './login'
import localstorage from '@u/localstorage'

Vue.use(Router)
let company = localstorage.get('XPLUSCompany') || 'laohu'
const routes = [
  ...home,
  ...course,
  ...workCircle,
  ...center,
  ...live,
  ...bookHouse,
  ...login
]

const router = new Router({
  mode: 'history',
  base: `/${company}/`,
  routes
})

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title // 设置页面title
  next()
})
//
router.afterEach(function (to, from) {
})

// 全局路由生命周期
export default router
