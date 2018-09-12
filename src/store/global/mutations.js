import * as types from './mutations_types'

export default {
  [types.USERINFO] (state) {
    state.userInfo = true
  },
  [types.LOADINGSTATUS] (state) {
    state.loadingStatus = true
  }
}
