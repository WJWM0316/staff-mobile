import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import settings from '@/config'
import store from '../store/index.js'
import router from '../router/index.js'
import localstorage from '@u/localstorage'
Vue.use(VueAxios, axios)
// 动态设置本地和线上接口域名
Vue.axios.defaults.baseURL = settings.host


let num = 0
export const request = ({type = 'post', url, data = {}, needLoading = true} = {}) => {
  let datas = type === 'get' ? {params: {...data}} : {...data}
  // 开发环境写死账号
  if (process.env.NODE_ENV !== 'production' && localstorage.get('token')) {
    if (type === 'get') {
      if (url.indexOf('?') !== -1) {
        url = `${url}&token=${localstorage.get('token')}`
      } else {
        url = `${url}?token=${localstorage.get('token')}`
      }
    } else {
      datas.token = localstorage.get('token')
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
    console.log(err.response)
    switch (err.response.status) {
      case 401: // 未登录或登录过期
        console.log(111)
        router.push('/login')
    }
    Vue.$vux.toast.text(err.response.data.msg, 'bottom')
    return Promise.reject(err.response.data.msg)
  })
}
