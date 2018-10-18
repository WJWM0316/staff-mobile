import * as types from './mutations_types'

export default {
  [types.RESOLVETIME] (state, data) {
    state.resolveTime = data
  },
  [types.SENDDATA] (state, data) {
    state.sendData = data
  },
  [types.RESOLVEDATA] (state, data) {
    state.resolveData = data
  },
  [types.WSSTATUS] (state, data) {
    state.wsStatus = data
  },
  [types.WSLOGIN] (state, data) {
    state.wsLogin = data
  },
  [types.ONLINENUM] (state, data) {
    state.onlineNum = data
  }
}
