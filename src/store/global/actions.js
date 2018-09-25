import * as types from './mutations_types'

export default {
  // 更新loading状态
  updata_loadingStatus: ({commit}, data) => {
    return new Promise((resolve, reject) => {
      commit(types.LOADINGSTATUS, data)
      resolve()
    })
  },
  // 更新loading文案
  updata_loadingTxt: ({commit}, data) => {
    return new Promise((resolve, reject) => {
      commit(types.LOADINGTXT, data)
      resolve()
    })
  },
  // 更新上拉加载状态
  updata_pullUpStatus: ({commit}, data) => {
    return new Promise((resolve, reject) => {
      commit(types.PULLUPSTATUS, data)
      resolve()
    })
  },
  // 更新下拉刷新状态
  updata_pullDownStatus: ({commit}, data) => {
    return new Promise((resolve, reject) => {
      commit(types.PULLDOWNSTATUS, data)
      resolve()
    })
  },
  // 更新用户信息
  updata_userInfo: ({commit}, data) => {
    return new Promise((resolve, reject) => {
      commit(types.USERINFO, data)
      resolve()
    })
  },
  // 更新音频索引
  updata_audioCurIndex: ({commit}, data) => {
    return new Promise((resolve, reject) => {
      commit(types.AUDIOCURINDEX, data)
      resolve()
    })
  }
}
