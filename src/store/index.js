import Vue from 'vue'
import Vuex from 'vuex'
import global from './global/'
import websocket from './websocket/'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    global,
    websocket
  }
})
