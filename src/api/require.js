import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import settings from '@/config'
import store from '../store/index.js'
import router from '../router/index.js'
import localstorage from '@u/localstorage'
import browser from '@u/browser'
Vue.use(VueAxios, axios)
let company = location.href.split('/')[3]
// 动态设置本地和线上接口域名
Vue.axios.defaults.baseURL = `${settings.host}/${company}`
Vue.axios.defaults.timeout = 20000

let num = 0
let token = localstorage.get('token')
let ssoToken = localstorage.get('ssoToken')
export const request = ({type = 'post', url, data = {}, needLoading = true, config = {}} = {}) => {
  // 微信授权接口host不一样
  if (url === '/sso_login/bind/wechat') {
    Vue.axios.defaults.baseURL = `${settings.oauthUrl}/`
  }
  if (url === '/auth/token') {
    Vue.axios.defaults.baseURL = `${settings.workUrl}/${company}`
  }
  
  // 开发环境写死账号
  if (process.env.NODE_ENV !== 'production' && token) {
    if (token) {
      Vue.axios.defaults.headers.common['Authorization'] = token
      Vue.axios.defaults.headers.common['Authorization-Sso'] = ssoToken
    }
  }
  let datas = type === 'get' ? {params: {...data}} : (data instanceof FormData ? data : {...data})
  if (needLoading) {
    num++
    if (!store.getters.loadingStatus) {
      store.dispatch('updata_loadingStatus', true)
    }
  }
  // 请求
  return Vue.axios[type](url, datas, config, needLoading).then(res => {
    num--
    if (num <= 0) {
      store.dispatch('updata_loadingStatus', false)
    }
    return Promise.resolve(res.data)
  }).catch(err => {
    num--
    if (num <= 0) {
      store.dispatch('updata_loadingStatus', false)
    }
    switch (err.response.status) {
      case 500: // 服务器异常
        Vue.$vux.toast.text('服务器异常', 'bottom')
        break
      case 401: // 未登录或登录过期
        if (browser.isWechat && !router.history.current.query.bind_code) {
          location.href = `${settings.oauthUrl}/wechat/oauth?redirect_uri=${encodeURIComponent(location.href)}`
        }
        break
    }
    Vue.$vux.toast.text(err.response.data.msg, 'bottom')
    return Promise.reject(err.response.data.msg)
  })
}
