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
import other from './other'
import settings from '@/config'

Vue.use(Router)
let company = localstorage.get('XPLUSCompany') || settings.defaultCompany
const routes = [
  ...home,
  ...course,
  ...workCircle,
  ...center,
  ...live,
  ...bookHouse,
  ...login,
  ...other
]

const router = new Router({
  mode: 'history',
  base: `/${company}/`,
  routes
})

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title // 设置页面title
  var u = navigator.userAgent
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
  // XXX: 修复iOS版微信HTML5 History兼容性问题
  let path = `/${company}${to.path}`
  if (isiOS && path !== location.pathname && to.meta.reload) {
    if (JSON.stringify(to.query) === '{}') {
      // 此处不可使用location.replace
      location.assign(`/${company}${to.fullPath}?redirect=true`)
    } else {
      location.assign(`/${company}${to.fullPath}&redirect=true`)
    }
  } else {
    next()
  }
})
router.afterEach(function (to, from) {
})

// 全局路由生命周期
export default router