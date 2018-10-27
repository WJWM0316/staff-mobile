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
if (process.env.NODE_ENV !== 'production') {
  Vue.axios.defaults.baseURL = settings.host
} else {
  Vue.axios.defaults.baseURL = `${settings.host}/${company}`
}
Vue.axios.defaults.timeout = 20000

let num = 0
let token = localstorage.get('token')
export const request = ({type = 'post', url, data = {}, needLoading = true, config = {}} = {}) => {
  // 开发环境token通过header传递
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
        if (browser.isWechat()) {
          location.href = `${settings.host}/wechat/oauth?redirect_uri=${encodeURIComponent(location.href)}`
        }   
        // router.push('/login')
        break
    }
    Vue.$vux.toast.text(err.response.data.msg, 'bottom')
    return Promise.reject(err.response.data.msg)
  })
}