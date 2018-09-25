<template>
  <div class='wrap'>
    <div class='header'>
      <p class='title'>教你如何高效记单词</p>
      <p class='msg'>
        <span class='status green' v-show='wsStatus === 1'>直播进行中</span>
        <span class='status red' v-show='wsStatus === 0'>直播连接中</span>
        <span class='status red' v-show='wsStatus === 2'>直播未连接</span>
        <span class='num'>{{onlineNum}}人参与</span>
      </p>
      <div class='more'>
        <span>更多介绍</span>
        <i class='icon iconfont icon-list_live_icon_more'></i>
      </div>
    </div>
    <div class='failShow' v-show='wsStatus === 2' @click.stop='creatWs'>
      <i class='icon iconfont icon-live_icon_question'></i>
      <div class='txt'>连接服务器失败，点击重新连接</div>
      <i class='icon iconfont icon-list_live_icon_more'></i>
    </div>
    <div class='main'>
      <scroller class='scroll'
        ref='scroll'
        :pulldown=true
        :pullup=true
        :listenScroll=true
        :freeScroll=true
        :list='list'
        downType='loadMore'
        bgColor = '#F9F9F9'
        @pullingDown='loadPrev'
        @pullingUp='loadNext'
        >
        <div class='startTime'>
          <span class='txt'>7月13日9:30 直播开始</span>
        </div>
        <div class='message' ref="message">
          <live-message
            v-for='(item, index) in list'
            :key='index'
            :audioList='audioList'
            :messageData='item'
            ref="messageItem"
            @nextMusic='nextMusic'
          ></live-message>
        </div>
        <!-- <p v-for='(n, index) in 200' :key='index'>{{n}}</p> -->
        <!-- <div class='endTime'>
          <span class='txt'>7月13日9:30 直播介绍</span>
        </div> -->
      </scroller>
      <div class="scrollBtn">
        <i class="btn" @click.stop="scrollTo('top')"><img src="@a/icon/live_btn_gotop@3x.png" alt=""></i>
        <i class="btn" @click.stop="scrollTo('bottom')"><img src="@a/icon/live_btn_gobase@3x.png" alt=""></i>
      </div>
    </div>
    <div class='footer'>
      <div class='txtBar'>
        <input class='bar' @focus.stop='focus' type='text' v-model='problemTxt' placeholder='请输入你的问题'>
      </div>
      <div class='submit' @click.stop='send(problemTxt)'>提问</div>
    </div>
    <div class='testBtn' @click='closeWs'>断线测试</div>
  </div>
</template>
<script>
import scroller from '@c/layout/scroller'
import localstorage from '@u/localstorage'
import ws from '@u/websocket'
import liveMessage from '@c/business/liveMessage'
import { mapState, mapActions } from 'vuex'
import { getLiveRoomMsgApi } from '@/api/pages/live'
let onMessage = null
export default {
  components: {
    scroller,
    liveMessage
  },
  data () {
    return {
      roomId: '',
      list: [],
      onlineNum: 0,
      problemTxt: '',
      resData: {},
      audioList: [] // 音频列表
    }
  },
  computed: {
    ...mapState({
      wsStatus: state => state.websocket.wsStatus,
      sendData: state => state.websocket.sendData
    })
  },
  watch: {
    list () {
      this.list.filter((item, index) => {
        if (item.type === 'audio') {
          item.index = index
          this.audioList.push(item)
        }
      })
    },
    wsStatus () {},
    sendData () {}
  },
  methods: {
    ...mapActions([
      'updata_sendData'
    ]),
    scrollTo (type) {
      switch (type) {
        case 'top':
          this.$refs.scroll.scrollTo(0, 0)
          break
        case 'bottom':
          this.$refs.scroll.scrollBottom()
          break
      }
    },
    getMessage ({page, action}) {
      let data = {
        id: this.roomId,
        action: action || 1,
        page: page || 1,
        count: 20
      }
      getLiveRoomMsgApi(data).then(res => {
        if (action) {
          this.list = this.list.concat(res.data)
        } else {
          this.list = res.data.concat(this.list)
        }
      })
    },
    nextMusic (index) {
      this.$refs.scroll.scrollToElement(this.$refs.message.getElementsByClassName('live-message')[index])
      this.$refs.messageItem[index].$children[0].play()
    },
    loadPrev () {
      setTimeout(() => {
        this.$refs.scroll.pulldownUi = false
        let data = []
        this.list = data.concat(this.list)
      }, 2000)
    },
    loadNext () {
      setTimeout(() => {
        this.$refs.scroll.pullupUi = false
      }, 2000)
    },
    focus () {
      // 强制输入框顶起
      setTimeout(() => {
        document.body.scrollTop = document.body.scrollHeight
      }, 100)
    },
    send (data) {
      ws.send(data)
    },
    closeWs () {
      ws.close()
    },
    creatWs () {
      ws.create('ws://work-api.xplus.ziwork.com/tiger')
    }
  },
  created () {
    this.roomId = this.$route.query.roomId
    this.getMessage({page: 1, action: 1})
  },
  mounted () {
    let that = this
    ws.create('ws://work-api.xplus.ziwork.com/tiger')
    onMessage = (obj) => {
      let data = obj.detail
      // 登录和退出登录逻辑
      if (data.hasOwnProperty('cmd')) {
        if (data.cmd === 'online_login') {
          that.onlineNum++
        } else if (data.cmd === 'online_logout') {
          that.onlineNum--
          if (that.onlineNum < 0) that.onlineNum = 0
        }
      // 接收信息处理
      } else if (data.hasOwnProperty('msg_type')) {
        switch (data.msg_type) {
          // 好友发过来的信息
          case 'friend_msg':
            that.list.push(data.data)
            that.$refs.scroll.scrollBottom()
            break
          // 自己发出去的信息后端接收成功后保存起来，若失败重新发送
          case 'msg_push':
            let sendList = this.sendData
            that.updata_sendData(sendList.push(data.data.content))
            break
        }
      }
    }
    window.addEventListener('wsOnMessage', onMessage)

    let sendTimer = null
    let num = 0
    // let messageList = [
    //   {
    //     cmd: 'msg.push',
    //     data: {
    //       to: {
    //         id: 11,
    //         type: 'friend',
    //         username: 'consequatur_exercitationem'
    //       },
    //       mine: {
    //         type: 'text',
    //         content: '测试',
    //         id: 15,
    //         mine: true,
    //         username: 'adipisci82'
    //       }
    //     }
    //   }
    // ]
    // sendTimer = setInterval(() => {
    //   this.send(messageList[0])
    //   num++
    // }, 3000)

    this.list = [
      {
        messageId: 0,
        type: 'audio',
        avatar: 'https://cdnstatic.ziwork.com/Uploads/Picture/Company/CgYXBlXcP3KAV3sVAABgX6zFmbs348.png',
        path: 'https://cdnstatic.ziwork.com/test/audio/2018-06-12/42e1cb3e80df6da33aaee09e266c513d.mp3',
        duration: '12',
        username: '测试测试测试'
      },
      {
        messageId: 1,
        type: 'text',
        avatar: 'https://cdnstatic.ziwork.com/Uploads/Picture/Company/CgYXBlXcP3KAV3sVAABgX6zFmbs348.png',
        duration: '12',
        content: '测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊',
        username: '测试测试测试'
      },
      {
        messageId: 2,
        type: 'text',
        avatar: 'https://cdnstatic.ziwork.com/Uploads/Picture/Company/CgYXBlXcP3KAV3sVAABgX6zFmbs348.png',
        duration: '12',
        content: '测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊',
        username: '测试测试测试'
      },
      {
        messageId: 3,
        type: 'audio',
        avatar: 'https://cdnstatic.ziwork.com/Uploads/Picture/Company/CgYXBlXcP3KAV3sVAABgX6zFmbs348.png',
        path: 'https://cdnstatic.ziwork.com/test/audio/2018-06-12/42e1cb3e80df6da33aaee09e266c513d.mp3',
        duration: '12',
        username: '测试测试测试'
      },
      {
        messageId: 2,
        type: 'text',
        avatar: 'https://cdnstatic.ziwork.com/Uploads/Picture/Company/CgYXBlXcP3KAV3sVAABgX6zFmbs348.png',
        duration: '12',
        content: '测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊测试数据啊',
        username: '测试测试测试'
      }
    ]
  },
  beforeDestroy () {
    window.removeEventListener('wsOnMessage', onMessage)
  }
}
</script>
<style lang='less' scoped>
  .testBtn {
    color: #fff;
    font-size: 14px;
    border: 1px solid #000;
    padding: 5px;
    position: fixed;
    bottom: 10%;
    right: 0%;
    background: red;
  }
  .wrap {
    width: 100%;
    height: 100vh;
    position: relative;
    .header {
      height: 52px;
      width: 100%;
      box-shadow:0px 1px 0px 0px rgba(0,0,0,0.05);
      background: #fff;
      padding: 7px 0;
      box-sizing: border-box;
      text-align: center;
      position: relative;
      .title {
        font-size: 30px; /*px*/
        font-weight:400;
        color: #22292C;
        line-height: 20px;
      }
      .msg {
        font-size:24px; /*px*/
        font-weight: 400;
        line-height: 16px;
        color: #929292;
        .status {
          margin-right: 10px;
          margin-bottom: 2px;
          position: relative;
          &.green::before {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #0FD685;
            content: '';
            position: absolute;
            top: 50%;
            margin-top: -1px;
            left: -10px;
          }
          &.red::before {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #FF3434;
            content: '';
            position: absolute;
            top: 50%;
            margin-top: -1px;
            left: -10px;
          }
        }
      }
      .more {
        font-size: 24px; /*px*/
        font-weight: 300;
        color: #666666;
        line-height: 17px;
        position: absolute;
        top: 18px;
        right: 12px;
        .icon-list_live_icon_more {
          font-size: 22px; /*px*/
          color: rgba(220, 220, 220, 1);
        }
      }
    }
    .failShow {
      width: 100%;
      height: 40px;
      position: fixed;
      top: 52px;
      left: 0;
      background: #FFF2F2;
      color: #FF3434;
      font-size: 28px; /*px*/
      font-weight: 400;
      padding: 0 14px 0 18px;
      z-index: 1;
      line-height: 40px;
      box-sizing: border-box;
      overflow: hidden;
      .txt {
        float: left;
      }
      .icon-live_icon_question {
        font-size: 40px; /*px*/
        margin-right: 14px;
        float: left;
      }
      .icon-list_live_icon_more {
        font-size: 24px; /*px*/
        float: right;
      }
    }
    .main {
      width: 100%;
      height: 100vh;
      padding: 52px 0;
      box-sizing: border-box;
      margin-top: -52px;
      .scroll {
        height: 100%;
        width: 100%;
        background: #F9F9F9;
        .startTime, .endTime {
          padding: 20px 0 30px;
          text-align: center;
          .txt {
            padding: 3px 20px;
            color: #929292;
            font-size: 24px; /*px*/
            line-height: 16px;
            font-weight: 400;
            background: #EDEDED;
            border-radius: 14px;
          }
        }
        .message {
          padding-bottom: 25px;
        }
      }
      .scrollBtn {
        position: fixed;
        top: 90px;
        right: 16px;
        .btn {
          width: 40px;
          height: 40px;
          display: block;
          margin-bottom: 7px;
          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }
      }
    }
    .footer {
      width: 100%;
      height: 52px;
      padding: 6px 0 6px 10px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: absolute;
      bottom: 0;
      left: 0;
      .txtBar {
        height: 40px;
        border-radius: 50px;
        background: #F8F8F8;
        flex: 1;
        overflow: hidden;
        border: 1px solid #EDEDED;
        box-sizing: border-box;
        .bar {
          width: 100%;
          height: 100%;
          display: block;
          color: #354048;
          font-size: 30px; /*px*/
          padding: 0 14px;
          border: none;
          ::-webkit-input-placeholder {
            color: #000;
          }
        }
      }
      .submit {
        font-size: 30px; /*px*/
        line-height: 20px;
        font-weight: 500;
        color: #D7AB70;
        padding: 0 17px 0 15px;
      }
    }
  }
</style>