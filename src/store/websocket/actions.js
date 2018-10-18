import * as types from './mutations_types'

export default {
  // 更新ws接收时间
  updata_resolveTime: ({commit}, data) => {
    return new Promise((resolve, reject) => {
      commit(types.RESOLVETIME, data)
      resolve()
    })
  },
  // 更新发送数据
  updata_sendData: ({commit}, data) => {
    return new Promise((resolve, reject) => {
      commit(types.SENDDATA, data)
      resolve()
    })
  },
  // 更新返回数据
  updata_resolveData: ({commit}, data) => {
    return new Promise((resolve, reject) => {
      commit(types.RESOLVEDATA, data)
      resolve()
    })
  },
  // 更新ws状态
  updata_wsStatus: ({commit}, data) => {
    return new Promise((resolve, reject) => {
      commit(types.WSSTATUS, data)
      resolve()
    })
  },
  // 更新ws登录
  updata_wsLogin: ({commit}, data) => {
    return new Promise((resolve, reject) => {
      commit(types.WSLOGIN, data)
      resolve()
    })
  },
  // 更新当前在线人数
  updata_onlineNum: ({commit}, data) => {
    return new Promise((resolve, reject) => {
      commit(types.ONLINENUM, data)
      resolve()
    })
  }
}
