import * as types from './mutations_types'

export default {
  [types.USERINFO] (state, data) {
    state.userInfo = data
  },
  [types.LOADINGSTATUS] (state, data) {
    state.loadingStatus = data
  },
  [types.LOADINGTXT] (state, data) {
    state.loadingTxt = data
  }
}
