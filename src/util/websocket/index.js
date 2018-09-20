import router from '@/router/index.js'
import localstorage from '@u/localstorage'
import store from '@/store/index.js'

class WS {
  ws = null
  url = ''
  isLogin = false
  keepAliveTimer = null // 心跳定时器
  reconnectMark = false // 是否重连过
  receiveMessageTimer = null // 接收定时器
  closeTime = 0 // ws断开的时间
  lastTealthTime = 0 // 上一次心跳发送的时间
  event = null // 自定义事件
  // 创建一个websocket
  create = (url) => {
    // 判断浏览器是否支持webSocket, 不支持直接alert提示
    if ('WebSocket' in window) {
      // 重新初始化
      this.ws = null // 垃圾回收释放缓存
      this.keepAliveTimer = null
      this.lastTealthTime = 0
      this.ws = new WebSocket(url)
      this.url = url
      let ws = this.ws
      // 握手
      ws.onopen = () => {
        this.lastTealthTime = 0
        // 先登录
        this.login()
        if (this.ws.readyState === 1) { // 为1表示连接处于open状态
          clearInterval(this.keepAliveTimer)
          this.keepAliveTimer = setInterval(() => { // 开启心跳检查
            this.checkConnect()
          }, 3000)
        }
        // 30s没收到信息，代表服务器出问题了，关闭连接。如果收到消息了，重置该定时器。
        clearTimeout(this.receiveMessageTimer)
        this.receiveMessageTimer = setTimeout(() => {
          this.close()
        }, 30000)
      }
      // 接收信息
      ws.onmessage = (evt) => {
        // evt.data如果等于a为心跳检测值，不需要转化成json格式
        let data = evt.data !== 'a' ? JSON.parse(evt.data) : evt.data
        if (data) {
          this.event = new CustomEvent('wsOnMessage', {detail: data})
          window.dispatchEvent(this.event)
        }
        // 判断登录状态
        if (data.cmd === 'login.token') {
          console.log('======WebSocket======' + data.msg)
          if (data.code === 200) {
            this.isLogin = true
            store.dispatch('updata_wsStatus', 1)
          } else if (data.code === 401) { // 登录失败重新登录
            this.isLogin = false
            router.push('/login')
          }
        }
        // 不是心跳返回的数据和登录的返回的数据, 存储起来
        if (data.cmd === 'msg.push') {
          let time = new Date().getTime()
          store.dispatch('updata_resolveTime', time)
          let lastData = store.getters.resolveData
          let dataList = lastData.push(data.data)
          store.dispatch('updata_resolveData', dataList)
        }
        // 收到消息，重置定时器, 因为已开启心跳检查，每秒都有发送
        clearTimeout(this.receiveMessageTimer)
        this.receiveMessageTimer = setTimeout(() => {
          this.close()
        }, 30000)
      }
      // 关闭监听
      ws.onclose = (e) => {
        console.log('======WebSocket连接已关闭======')
        this.reConnect()
      }
      // 错误监听
      ws.onerror = (e) => {
        console.log('======WebSocket连接失败======')
      }
    } else {
      alert('您的浏览器不支持 WebSocket，请更换浏览器')
    }
  }
  // 登录
  login = () => {
    let data = {
      cmd: 'login.token',
      token: localstorage.get('token'),
      data: {}
    }
    this.send(data)
  }
  // 发送消息
  send = (data) => {
    if (this.ws.readyState === 1) {
      this.ws.send(JSON.stringify(data))
    }
  }
  // 接收数据
  resolve = (data) => {
    this.ws.onmessage = (evt) => {
      console.log(evt.data)
      data = evt.data
    }
    return data
  }
  // 关闭websocket
  close = () => {
    this.ws.close()
  }
  // 用于心跳包检测websocket
  checkConnect = () => {
    // 断网检查
    this.keepalive()
    this.send('q')
    this.lastTealthTime = new Date().getTime()
  }
  // 补充断网情况下，send发不出去的处理逻辑
  keepalive = () => {
    let time = new Date().getTime()
    if (this.lastTealthTime !== 0 && time - this.lastTealthTime > 20000) { // 距离上一次心跳已经过了20s，说明死了
      this.close()
    } else {
      // 没有字节在缓存且还在连接中
      if (this.ws.bufferedAmount === 0 && this.ws.readyState === 1) {
        this.lastTealthTime = time
      }
    }
  }
  // 断线重连
  reConnect = () => {
    clearInterval(this.keepAliveTimer)
    clearTimeout(this.receiveMessageTimer)
    if (!this.reconnectMark) { // 如果没有重连过，进行重连。
      this.closeTime = new Date().getTime()
      this.reconnectMark = true
    }
    if (new Date().getTime() - this.closeTime >= 10000) { // 10秒中重连，连不上就不连了
      console.log('======websocket重连不上，自动关闭')
      store.dispatch('updata_wsStatus', 2)
      this.close()
    } else {
      store.dispatch('updata_wsStatus', 0)
      this.create(this.url) // 断线重连
    }
  }
}

export default new WS()
