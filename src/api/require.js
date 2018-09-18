import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import settings from '@/config'
import store from '../store/index.js'
import router from '../router/index.js'

Vue.use(VueAxios, axios)
// 动态设置本地和线上接口域名
Vue.axios.defaults.baseURL = settings.host


let num = 0
export const request = ({type = 'post', url, data = {}, needLoading = true} = {}) => {
  let datas = type === 'get' ? {params: {...data}} : {...data}
  if (type === 'put') {
    url = `${url}&token=88ed0efff32c7041a8790acd8e44bff5`
  }
  // 开发环境写死账号
  if (process.env.NODE_ENV !== 'production') {
    if (type === 'get') {
      if (url.indexOf('?') !== -1) {
        url = `${url}&token=88ed0efff32c7041a8790acd8e44bff5`
      } else {
        url = `${url}?token=88ed0efff32c7041a8790acd8e44bff5`
      }
    } else {
      datas.token = '88ed0efff32c7041a8790acd8e44bff5'
    }
  }
  if (needLoading) {
    num++
    if (!store.getters.loadingStatus) {
      store.dispatch('updata_loadingStatus', true)
    }
  }
  return Vue.axios[type](url, datas, needLoading).catch(response => {
    num--
    if (num <= 0) {
      store.dispatch('updata_loadingStatus', false)
    }
    return Promise.reject(response, {code: 500, message: '网络异常'})
  }).then(res => {
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
    Vue.$vux.toast.text(err.response.data.msg, 'bottom')
    return Promise.reject(err.response.data.msg)
  })
}
