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
  // 开发环境写死账号
  if (process.env.NODE_ENV !== 'production' && token) {
    if (token) {
      Vue.axios.defaults.headers.common['Authorization'] = token
    }
  }
  let datas
  /* 是否发生formdata */
  if (config.headers) {
    datas = type === 'post' ? data : {params: {...data}}
  } else {
    datas = type === 'post' ? {...data} : {params: {...data}}
  }
  if (needLoading) {
    num++
    if (!store.getters.loadingStatus) {
      store.dispatch('updata_loadingStatus', true)
    }
  }
  // 请求
  return Vue.axios[type](url, datas, config, needLoading).catch(response => {
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
    switch (err.response.status) {
      case 500: // 服务器异常
        Vue.$vux.toast.text('服务器异常', 'bottom')
        break
      case 401: // 未登录或登录过期
        router.push('/login')
        break
    }
    Vue.$vux.toast.text(err.response.data.msg, 'bottom')
    return Promise.reject(err.response.data.msg)
  })
}
