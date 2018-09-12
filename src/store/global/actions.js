import * as types from './mutations_types'

export default {
  // 更新loading状态
  updata_loadingStatus: ({commit}, data) => {
    return new Promise((resolve, reject) => {
      commit(types.LOADINGSTATUS, data)
      resolve()
    })
  },
  updata_loadingTxt: ({commit}, data) => {
    return new Promise((resolve, reject) => {
      commit(types.LOADINGTXT, data)
      resolve()
    })
  },
  // 更新用户信息
  updata_userInfo: ({commit}, data) => {
    return new Promise((resolve, reject) => {
      commit(types.USERINFO, data)
      resolve()
    })
  }
}
