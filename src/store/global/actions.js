import * as types from './mutations_types'

export default {
  show_nav: ({commit}) => {
    return new Promise((resolve, reject) => {
      commit(types.SHOW_NAV)
      resolve()
    })
  }
}
