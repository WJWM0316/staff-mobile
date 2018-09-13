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


let num = 0
export const request = ({type = 'post', url, data = {}, needLoading = true} = {}) => {
  data.token = '17ee48397b6b80e6e1053c8958dfc438'
  let datas = type === 'get' ? {params: {...data}} : {...data}
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
    store.dispatch('updata_loadingStatus', false)
    return Promise.resolve(res)
  }).catch(err => {
    num--
    if (num <= 0) {
      store.dispatch('updata_loadingStatus', false)
    }
    Vue.$vux.toast.text(err.response.data.msg, 'bottom')
    return Promise.reject(err.response.data.msg)
  })
}
