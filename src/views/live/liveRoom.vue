<template>
  <div class='wrap' v-if="liveDetail.title">
    <div class='header'>
      <p class='title'>{{liveDetail.title}}</p>
      <p class='msg'>
        <span class='status green' v-show='liveDetail.status === 2 && wsStatus === 1'>直播进行中</span>
        <span class='status red' v-show='liveDetail.status === 2 && wsStatus === 0'>直播连接中</span>
        <span class='status red' v-show='liveDetail.status === 2 && wsStatus === 2'>直播断开，连接中…</span>
         <span class='status red' v-show='liveDetail.status === 3'>直播已结束</span>
        <span class='num' v-if="liveDetail.status !== 3">{{onlineNum}}人参与</span>
      </p>
      <div class='more' @click.stop="jumpMore" v-if="!liveDetail.isTutor">
        <span>更多介绍</span>
        <i class='icon iconfont icon-list_live_icon_more'></i>
      </div>
      <div class="end" v-else @click.stop="endLive">
        <i class='icon iconfont icon-close'></i>
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
        :pulldown='isPulldown'
        :pullup='isPullup'
        :listenScroll=true
        :freeScroll=true
        :list='list'
        downType='loadMore'
        bgColor = '#F9F9F9'
        @pullingDown='loadPrev'
        @pullingUp='loadNext'
        >
        <div class='startTime'>
          <span class='txt'>{{liveDetail.expectedStartTime * 1000 | date('MMMDo hh:mm')}} 直播开始</span>
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
        <div class='endTime' v-if="liveDetail.status === 3">
          <span class='txt'>{{liveDetail.endTime * 1000 | date('MMMDo hh:mm')}} 直播结束</span>
        </div>
      </scroller>
      <div class="scrollBtn">
        <i class="btn" @click.stop="scrollTo('top')"><img src="@a/icon/live_btn_gotop@3x.png" alt=""></i>
        <i class="btn" @click.stop="scrollTo('bottom')"><img src="@a/icon/live_btn_gobase@3x.png" alt=""></i>
      </div>
    </div>
    <!-- 普通学员操作权限 -->
    <template v-if="!liveDetail.isTutor">
    <div class='footer'>
      <div class='txtBar'>
        <input class='bar' v-focus type='text' v-model='problemTxt' placeholder='请输入你的问题'>
      </div>
      <div class='submit' @click.stop='putQuestions'>提问</div>
      <div class="area icon iconfont icon-live_btn_answers" @click.stop="openArea = true"></div>
    </div>
    </template>
    <!-- 导师操作权限 -->
    <template v-else>
      <div class="sendArea">
        <div class="operArea">
          <span @click.stop="tutorOper('text')"><i class="icon1 iconfont icon-icon_writing" :class="{'curOperType': curOperType === 'text'}"></i></span>
          <span @click.stop="tutorOper('audio')"><i class="icon2 iconfont icon-btn_record" :class="{'curOperType': curOperType === 'audio'}"></i></span>
          <span @click.stop="tutorOper('img')">
            <i class="icon3 iconfont icon-btn_photo"></i>
            <upLoadFile
             class="upLoadImg"
             attach_type="img"
             count='1'
             @upLoadResult="upLoadResult"
            >
            </upLoadFile>
          </span>
          <span @click.stop="tutorOper('answer')">
            <i class="icon4 iconfont icon-icon_mymeaasage" :data-num="1"></i>
          </span>
        </div>
        <div class="typeBox">
          <div class="textType" v-if="curOperType === 'text'">
            <botInput @sendMsg="sendMsg"></botInput>
          </div>
          <div class="audioType" v-if="curOperType === 'audio'">
            <recorder @upload-success="upLoadResult"></recorder>
          </div>
        </div>
      </div>
    </template>
    <!-- 问答区 -->
    <questionArea :show="openArea" @closeArea="_closeArea" v-if="!liveDetail.isTutor"></questionArea>
    <answerArea :show="openArea" @closeArea="_closeArea" :tutorInfo="liveDetail" v-else></answerArea>
  </div>
</template>
<script>
import scroller from '@c/layout/scroller'
import localstorage from '@u/localstorage'
import ws from '@u/websocket'
import liveMessage from '@c/business/liveMessage'
import questionArea from '@c/business/questionArea'
import answerArea from '@c/business/answerArea'
import recorder from '@c/functional/recorder'
import upLoadFile from '@c/functional/upLoadFile'
import botInput from '@c/layout/botInput'
import { mapState, mapActions } from 'vuex'
import settings from '@/config'
import { getLiveRoomMsgApi, putQuestionsApi, sendLiveMsgApi, msgPositionApi, getLiveDetailApi, putUpdataLiveApi } from '@/api/pages/live'
let onMessage = null
export default {
  components: {
    scroller,
    liveMessage,
    questionArea,
    answerArea,
    recorder,
    upLoadFile,
    botInput
  },
  data () {
    return {
      option: {
        liveId: this.$route.query.id,
        teacherId: null,
        type: null
      },
      liveDetail: {
        status: null,
        title: null,
        expectedStartTime: null
      },
      id: '',
      list: [],
      problemTxt: '', // 提交的问题
      openArea: false,
      isPulldown: true, // 是否开启下拉
      isPullup: true, // 是否开启上拉
      audioList: [], // 音频列表
      curOperType: null, // 导师选择发布的类型
      fileId: null // 导师发布的附件id
    }
  },
  computed: {
    ...mapState({
      wsStatus: state => state.websocket.wsStatus,
      sendData: state => state.websocket.sendData,
      onlineNum: state => state.websocket.onlineNum
    })
  },
  watch: {
    list () {},
    wsStatus () {},
    liveDetail () {
      if (this.liveDetail.status === 2) {
        this.isPullup = false
      }
    },
    sendData () {}
  },
  methods: {
    ...mapActions([
      'updata_sendData',
      'updata_onlineNum'
    ]),
    upLoadResult (e) {
      this.fileId = e[0].id
      this.sendMsg()
    },
    jumpMore () {
      this.$router.push(`/liveDetail?id=${this.id}`)
    },
    tutorOper (type) {
      this.curOperType = type
      if (type === 'answer') {
        this.openArea = true
      }
    },
    sendMsg (tutorTxt) {
      this.option.type = 'text'
      if (this.curOperType === 'text') {
        this.option.content = tutorTxt
      } else {
        this.option.fileId = this.fileId
      }
      sendLiveMsgApi(this.option).then(res => {
      })
    },
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
    _closeArea () {
      this.openArea = false
    },
    async getDetail () {
      let res = await getLiveDetailApi({id: this.option.liveId})
      this.liveDetail = res.data
      this.option.teacherId = res.data.masterUid
      // 直播未结束都可以加入直播
      if (this.liveDetail.status !== 3) {
        this.addLive()
      }
    },
    getMessage ({msgId, action, needLoading = true}) {
      let data = {
        id: this.id,
        action: action || 1,
        msgId: msgId || 0,
        count: 20
      }
      return getLiveRoomMsgApi(data, needLoading).then(res => {
        if (action === 1) {
          this.list = this.list.concat(res.data)
          res.data.filter((item, index) => {
            if (item.type === 'audio') {
              item.index = index
              this.audioList.push(item)
            }
          })
        } else {
          this.list = res.data.concat(this.list)
          res.data.filter((item, index) => {
            if (item.type === 'audio') {
              item.index = index
              this.audioList.unshift(item)
            }
          })
        }
        this.$nextTick(() => {
          if (this.liveDetail.status === 2) {
            setTimeout(() => {
              this.$refs.scroll.scrollBottom()
            }, 500)
          }
        })
        return res
      })
    },
    nextMusic (index) {
      this.$refs.scroll.scrollToElement(this.$refs.message.getElementsByClassName('live-message')[index])
      this.$refs.messageItem[index].$children[0].play()
    },
    loadPrev () {
      if (this.isPulldown && this.list[0].messageId) {
        this.getMessage({msgId: this.list[0].messageId, action: 2, needLoading: false}).then(res => {
          this.$refs.scroll.pulldownUi = false
          // 等scroll重新渲染完毕后定位到上次的位置
          setTimeout(() => {
            this.$refs.scroll.scrollToElement(this.$refs.message.getElementsByClassName('live-message')[res.data.length - 1], 0)
          }, 300)
          if (res.data.length === 0) {
            this.isPulldown = false
          }
        })
      }
    },
    loadNext () {
      if (this.isPullup && this.list[this.list.length - 1].messageId) {
        this.getMessage({msgId: this.list[this.list.length - 1].messageId, action: 1, needLoading: false}).then(res => {
          this.$refs.scroll.pullupUi = false
          if (res.data.length === 0) {
            this.isPullup = false
          }
        })
      }
    },
    putQuestions () {
      if (this.problemTxt !== '') {
        return new Promise((resolve, reject) => {
          let data = {
            live_id: this.id,
            master_uid: this.option.teacherId,
            content: this.problemTxt
          }
          putQuestionsApi(data).then(res => {
            this.problemTxt = ''
            this.$toast({
              text: '提交成功',
              type: 'success'
            })
            resolve(res)
          })
        })
      } else {
        this.$toast({
          text: '提问内容不能为空',
          type: 'text',
          width: '10em'
        })
      }
    },
    send (data) {
      ws.send(data)
    },
    creatWs () { // 开启websocket
      let company = location.href.split('/')[3] || 'tiger'
      let websocketUrl = settings.websocketUrl
      ws.create(`${websocketUrl}/${company}`)
    },
    closeWs () {
      ws.close()
    },
    addLive () { // 加入直播间
      ws.addLive(this.id)
    },
    leaveLive () {
      ws.leaveLive(this.id)
    },
    endLive () {
      this.$confirm({
        title: '结束直播',
        content: '1.直播结束后，不可以继续更新内容 \n2.直播结束3天后，不会再收到学员的提问，但可以回答学员的问题',
        confirmBack: () => {
          if (!this.liveDetail.isTutor) return
          let data = {
            liveId: this.id,
            status: 3
          }
          putUpdataLiveApi(data)
        }
      })
    },
    startLive () {
      this.$confirm({
        title: '开始直播',
        content: '1.开始直播后，可发送语音、文字、图片内容 \n2.开始直播后，所有学员都可进入直播间 \n3.在顶部栏右上角，点击结束按钮可结束直播',
        confirmBack: () => {
          if (!this.liveDetail.isTutor) return
          let data = {
            liveId: this.id,
            status: 2
          }
          putUpdataLiveApi(data)
        }
      })
    }
  },
  created () {
    let {id, openArea} = this.$route.query
    this.id = id
    if (openArea) this.openArea = true
    this.getDetail()
    this.getMessage({page: 1, action: 1})
  },
  mounted () {
    let that = this
    // 直播消息回调
    onMessage = (obj) => {
      let data = obj.detail
      // 登录和退出登录逻辑
      if (data.hasOwnProperty('cmd')) {
      // 接收信息处理
      } else if (data.hasOwnProperty('msgType')) {
        switch (data.msgType) {
          // 接收他人的信息
          case 'live_msg':
            that.list.push(data.data)
            that.$refs.scroll.scrollBottom('liveMsg')
            if (data.data.type === 'audio') {
              that.audioList.push(data.data)
            }
            break
          // 自己发出去的信息后端接收成功后保存起来，若失败重新发送
          case 'msg_push':
            let sendList = that.sendData
            that.updata_sendData(sendList.push(data.data.content))
            break
          // 其他人加入该直播间
          case 'live_login':
            that.updata_onlineNum(data.data.onlineLiveCount)
            break
          // 其他人离开该直播间
          case 'live_logout':
            that.updata_onlineNum(data.data.onlineLiveCount)
            break
          // 直播结束
          case 'live_end': {
            that.liveDetail.status = 3
          }
        }
      }
    }
    window.addEventListener('wsOnMessage', onMessage)
  },
  beforeDestroy () {
    if (this.liveDetail.status === 3 && this.list.length > 0) {
      let data = {
        liveId: this.id,
        messageId: this.list[this.list.length - 1].messageId
      }
      msgPositionApi(data)
    }
    window.removeEventListener('wsOnMessage', onMessage)
  }
}
</script>
<style lang='less' scoped>
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
        margin: 0 auto;
        margin: 0 auto;
        font-size: 30px; /*px*/
        font-weight: 700;
        color: #22292C;
        line-height: 20px;
        .setEllipsis(50%);
      }
      .msg {
        font-size:24px; /*px*/
        font-weight: 300;
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
      .end {
        width: 29px;
        height: 29px;
        background: #F8F8F8;
        border: 1px solid rgba(220,220,220,1);
        position: absolute;
        top: 11px;
        right: 12px;
        box-sizing: border-box;
        border-radius: 50%;
        .icon-close {
          font-size: 36px; /*px*/
          color: #354048;
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
      font-weight: 300;
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
            font-weight: 300;
            background: #EDEDED;
            border-radius: 14px;
          }
        }
        .message {
          padding-bottom: 25px;
          .live-message::last-child {
            padding-bottom: 0;
          }
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
        font-weight: 700;
        color: #D7AB70;
        padding: 0 0 0 16px;
      }
      .icon-live_btn_answers {
        font-size: 30px; /*px*/
        color: #D7AB70;
        padding: 0 20px 0 22px;
      }
    }
    .sendArea {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: #fff;
      box-shadow:0px -1px 0px 0px rgba(0,0,0,0.05);
      .operArea {
        width: 100%;
        height: 49px;
        box-sizing: border-box;
        display: flex;
        > span {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          .icon1 {
            font-size: 38px; /*px*/
            color: rgb(53, 64, 72);
          }
          .icon2 {
            font-size: 42px; /*px*/
            color: rgb(53, 64, 72);
          }
          .icon3 {
            font-size: 33px; /*px*/
            color: rgb(53, 64, 72);
          }
          .icon4 {
            font-size: 38px; /*px*/
            color: rgb(53, 64, 72);
            position: relative;
            &::after {
              content: attr(data-num);
              width: 15px;
              height: 15px;
              border-radius: 50%;
              background: #FF4949;
              font-size: 18px; /*px*/
              color: #fff;
              line-height: 15px;
              text-align: center;
              position: absolute;
              top: -5px;
              right: -5px;
            }
          }
          .curOperType {
            color: rgb(215, 175, 112);
          }
          .upLoadImg {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
          }
        }
      }
      .typeBox {
        box-shadow: 0px -1px 0px 0px rgba(0,0,0,0.05);
      }
    }
  }
</style>