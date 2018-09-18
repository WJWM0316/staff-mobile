import router from '@/router/index.js'
import localstorage from '@u/localstorage'
class WS {
  ws = null
  isLogin = false
  keepAliveTimer = null // 心跳定时器
  reconnectMark = false // 是否重连过
  receiveMessageTimer = null // 接收定时器
  closeTime = 0 // ws断开的时间
  lastTealthTime = 0 // 上一次心跳发送的时间
  // 创建一个websocket
  create = (url) => {
    // 判断浏览器是否支持webSocket, 不支持直接alert提示
    if ('WebSocket' in window) {
      // 重新初始化
      this.ws = null // 垃圾回收释放缓存
      this.keepAliveTimer = null
      this.reconnectMark = false
      this.lastTealthTime = 0
      this.ws = new WebSocket(url)
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
          }, 5000)
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
        // 判断登录状态
        if (data.cmd === 'login.token') {
          console.log('======WebSocket======' + data.msg)
          if (data.code === 200) {
            this.isLogin = true
          } else if (data.code === 401) { // 登录失败重新登录
            this.isLogin = false
            router.push('/login')
          }
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
        clearInterval(this.keepAliveTimer)
        clearTimeout(this.receiveMessageTimer)
        if (!this.reconnectMark) { // 如果没有重连过，进行重连。
          this.closeTime = new Date().getTime()
          this.reconnectMark = true
        }
        if (new Date().getTime() - this.closeTime >= 10000) { // 10秒中重连，连不上就不连了
          this.close()
        } else {
          this.create(url) // 断线重连
        }
      }
      // 错误监听
      ws.onerror = (e) => {
        clearInterval(this.keepAliveTimer)
        console.log('======WebSocket连接失败======')
        this.create(url) // 断线重连
      }
      this.keepalive()
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
    this.ws.send(JSON.stringify(data))
  }
  // 关闭websocket
  close = () => {
    this.ws.close()
  }
  // 用于心跳包检测websocket
  checkConnect = () => {
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
}

export default new WS()