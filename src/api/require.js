import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import settings from '@/config'
import store from '../store/index.js'
import router from '../router/index.js'
// import localstorage from '@/util/localstorage/index'

Vue.use(VueAxios, axios)
// 动态设置本地和线上接口域名
Vue.axios.defaults.baseURL = settings.host


// http request 拦截器  控制loading
let num = 0
axios.interceptors.request.use(
  config => {
    num++
    store.dispatch('updata_loadingStatus', true)
    return Promise.resolve(config)
  },
  err => {
    return Promise.reject(err)
  }
)
// http response 拦截器
axios.interceptors.response.use(
  response => {
    num--
    if (num <= 0) {
      store.dispatch('updata_loadingStatus', false)
    }
    return response
  },
  error => {
    num--
    if (num <= 0) {
      store.dispatch('updata_loadingStatus', false)
    }
    Vue.$vux.toast.text(error.response.data.msg, 'bottom')
    return Promise.reject(error.response.data) //  返回接口返回的错误信息
  }
)

export const request = ({type = 'post', url, data = {}, config = {}} = {}) => {
  let datas = type === 'get' ? {params: {...data}} : {...data}
  return Vue.axios[type](url, datas, config).catch(response => {
    return Promise.reject(response, {code: 500, message: '网络异常'})
  }).then().catch(err => {
    return Promise.reject(err)
  })
}
