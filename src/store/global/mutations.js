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
  },
  [types.PULLUPSTATUS] (state, data) {
    state.pullUpStatus = data
  },
  [types.PULLDOWNSTATUS] (state, data) {
    state.pullDownStatus = data
  },
  [types.AUDIOCURINDEX] (state, data) {
    state.audioCurIndex = data
  }
}
