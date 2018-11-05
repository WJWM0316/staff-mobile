import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import settings from '@/config'
import store from '../store/index.js'
import router from '../router/index.js'
import localstorage from '@u/localstorage'
import browser from '@u/browser'
import { bindWxLogin, tokenLogin, ssoLoginApi, loginApi } from '@/api/pages/login'
Vue.use(VueAxios, axios)
let token = localstorage.get('token')
let company = localstorage.get('XPLUSCompany') || settings.defaultCompany
let ssoToken = localstorage.get('ssoToken')
// 动态设置本地和线上接口域名
Vue.axios.defaults.baseURL = `${settings.host}/${company}`
Vue.axios.defaults.timeout = 20000
let num = 0 // 处理loading的显示逻辑
export const request = ({type = 'post', url, data = {}, needLoading = true, config = {}} = {}) => {
  // 微信授权接口host不一样
  if (url === '/sso_login/bind/wechat' || url === '/unifyauth/login' || url === '/unifyauth/captcha' || url === '/sso/user/companies') {
    Vue.axios.defaults.baseURL = `${settings.oauthUrl}/`
  } else if (url === '/auth/token') {
    company = localstorage.get('XPLUSCompany')
    Vue.axios.defaults.baseURL = `${settings.workUrl}/${company}`
  } else {
    if (Vue.axios.defaults.baseURL !== `${settings.host}/${company}`) {
      Vue.axios.defaults.baseURL = `${settings.host}/${company}`
    }
  }
  // 开发环境写死账号
  if (token) {
    Vue.axios.defaults.headers.common['Authorization'] = token
  }
  if (ssoToken) {
    Vue.axios.defaults.headers.common['Authorization-Sso'] = ssoToken
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
    return process(res)
  }).catch(err => {
    num--
    if (num <= 0) {
      store.dispatch('updata_loadingStatus', false)
    }
    switch (err.response.status) {
      case 401: // 未登录或登录过期
        if (browser.isWechat() && !router.history.current.query.bind_code) {
          location.href = `${settings.oauthUrl}/wechat/oauth?redirect_uri=${encodeURIComponent(location.href)}`
        }
        if (!browser.isWechat()) {
          router.push(`/login?redirect_url=${encodeURIComponent(location.href)}`)
        }
        break
    }
    Vue.toast({
      text: err.response.data.msg,
      position: 'bottom',
      width: '10em'
    })
    return Promise.reject(err.response.data)
  })
}

// 微信授权登录
export const wxLogin = (data, redirect) => {
  return new Promise((resolve, reject) => {
    bindWxLogin(data).then(res => {
      // 绑定微信号成功
      if (res.httpStatus === 200) {
        localstorage.set('XPLUSCompany', res.data.companies[0].code) // 储存公司名
        localstorage.set('ssoToken', res.data.ssoToken) // 储存ssoToken值
        tokenLogin({sso_token: res.data.ssoToken}).then(res0 => {
          let redirectUrl = router.history.current.fullPath
          localstorage.set('token', res0.data.token) // 储存token值
          resolve(res0)
          Vue.toast({
            text: '登录成功',
            type: 'success',
            callBack: () => {
              location.href = `${location.href.split('/')[0]}//${location.host}/${res.data.companies[0].code}/${redirectUrl}&redirect=true` // 登录成功跳转到相应的公司
            }
          })
        })
      }
      if (res.httpStatus === 400) {
        location.href = `${settings.oauthUrl}/wechat/oauth?redirect_uri=${encodeURIComponent(location.href)}`
      }
    })
  })
}

// 登录
export const login = (data, version, companyCode) => {
  return new Promise((resolve, reject) => {
    function loginFun (code) {
      company = localstorage.get('XPLUSCompany')
      loginApi(data).then(res0 => {
        localstorage.set('token', res0.data.token) // 储存token值
        Vue.toast({
          text: '登录成功',
          type: 'success',
          callBack: () => {
            localstorage.set('account', data) // 储存登录账号
            // version 为0 即没有特意去切换导师端还是员工端，就返回上一步， 没有上一步默认去到员工端首页
            if (!version) {
              if (router.history.current.query.redirect_url) {
                location.href = decodeURIComponent(router.history.current.query.redirect_url)
                localstorage.set('curHome', 'home') // 当前首页为员工端首页
              } else {
                location.href = `${location.href.split('/')[0]}//${location.host}/${code}/home`
              }
            } else {
              // 为2 即切换了员工端， 为1 即切换到了导师端
              if (version === 2) {
                location.href = `${location.href.split('/')[0]}//${location.host}/${code}/home`
              } else {
                location.href = `${location.href.split('/')[0]}//${location.host}/${code}/homeTc`
              }
            }
          }
        })
      })
    }
    // 没有微信授权或者微信授权后没有绑定的走正常登陆流程
    if (!router.history.current.query.bind_code) {
      // 如果没有公司信息，需要先获取ssoToken, 否则直接去公司登录
      if (!companyCode) {
        ssoLoginApi(data).then(res => {
          localstorage.set('ssoToken', res.data.ssoToken) // 储存ssoToken值
          localstorage.set('XPLUSCompany', res.data.companies[0].code) // 储存公司code
          localstorage.set('XPLUSCompanyName', res.data.companies[0].companyName) // 储存公司名
          localstorage.set('XPLUSCompanyList', res.data.companies) // 储存公司列表
          loginFun(res.data.companies[0].code)
        }).catch(e => {
          reject(e)
        })
      } else {
        loginFun(companyCode)
      }
    }
    // 微信授权后有绑定的直接微信登陆
    if (router.history.current.query.bind_code) {
      data.is_bind = router.history.current.query.is_bind
      data.bind_code = router.history.current.query.bind_code
      wxLogin(data)
    }
  })
}

/* code状态码处理 */
async function process (res) {
  return Promise.resolve(res.data)
}