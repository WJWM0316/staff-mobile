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
// 请求拦截器
Vue.axios.interceptors.request.use(
  config => {
    config.headers.common['Authorization'] = localstorage.get('token')
    return config
  },
  error => {
    return Promise.error(error)
  }
)

let num = 0
let token = localstorage.get('token')
export const request = ({type = 'post', url, data = {}, needLoading = true, config = {}} = {}) => {
  // 微信授权接口host不一样
  if (url === '/bind/wechat') {
    Vue.axios.defaults.baseURL = `${settings.oauthUrl}/${company}`
  }
  // 开发环境写死账号
  if (process.env.NODE_ENV !== 'production' && token) {
    if (token) {
      Vue.axios.defaults.headers.common['Authorization'] = token
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
        // alert(router.history.current.query)
        // if (browser.isWechat && router.history.current.query.is_bind !== 1) {
        //   location.href = `${settings.oauthUrl}/wechat/oauth?redirect_uri=${encodeURIComponent(location.href)}`
        // } else {
        //   // router.push('/login')
        // }
        router.push('/login')
        break
    }
    Vue.$vux.toast.text(err.response.data.msg, 'bottom')
    return Promise.reject(err.response.data.msg)
  })
}
