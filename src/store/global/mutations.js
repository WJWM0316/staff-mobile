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
  [types.AUDIOCURID] (state, data) {
    state.audioCurId = data
  },
  [types.VIDEOINDEX] (state, data) {
    state.videoIndex = data
  },
  [types.WXCONFIGURL] (state, data) {
    state.wxConfigUrl = data
  },
  [types.CURAUDIOURL] (state, data) {
    state.curAudioURL = data
  }
}
