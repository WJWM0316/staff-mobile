import * as types from './mutations_types'

export default {
  // 更新用户信息
  updata_userInfo: ({commit}, data) => {
    return new Promise((resolve, reject) => {
      commit(types.USERINFO, data)
      resolve()
    })
  }
}
