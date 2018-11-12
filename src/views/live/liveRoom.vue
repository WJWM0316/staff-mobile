<template>
  <div class='wrap' v-if="liveDetail.title">
    <div class='header'>
      <p class='title'>{{liveDetail.title}}<i class="icon iconfont icon-me_icon_edit_chevron" v-if="liveDetail.isTutor" @click.stop="jumpMore"></i></p>
      <p class='msg'>
        <span class='status green' v-show='liveDetail.status === 2 && wsStatus === 1'>直播进行中</span>
        <span class='status red' v-show='liveDetail.status === 2 && wsStatus === 0'>直播连接中</span>
        <span class='status red' v-show='liveDetail.status === 2 && wsStatus === 2'>直播断开，连接中…</span>
        <span class='status red' v-if='liveDetail.status === 3'>直播已结束</span>
        <span class='status red' v-if='liveDetail.status === 1'>直播未开始</span>
        <span class='num' v-if="liveDetail.status === 2 && wsStatus === 1">{{onlineNum}}人参与</span>
      </p>
      <div class='more' @click.stop="jumpMore" v-if="!liveDetail.isTutor">
        <span>更多介绍</span>
        <i class='icon iconfont icon-me_icon_edit_chevron'></i>
      </div>
      <div class="end" v-if="liveDetail.isTutor && liveDetail.status === 2" @click.stop="endLive">
        <i class='icon iconfont icon-close'></i>
      </div>
    </div>
    <div class='failShow' v-show='wsStatus === 2' @click.stop='creatWs'>
      <i class='icon iconfont icon-live_icon_question'></i>
      <div class='txt'>连接服务器失败，点击重新连接</div>
      <i class='icon iconfont icon-me_icon_edit_chevron'></i>
    </div>
    <!-- 返回最顶部最底部按钮 -->
    <div class='main' ref="main" :class="{'text': curOperType === 'text', 'audio': curOperType === 'audio'}">
      <scroller class='scroll'
        ref='scroll'
        :pulldown='isPulldown'
        :pullup='isPullup'
        :listenScroll=true
        :freeScroll=true
        :list='list'
        :scrollerHeight="scrollerHeight"
        downType='loadMore'
        bgColor = '#F9F9F9'
        @pullingDown='loadPrev'
        @pullingUp='loadNext'
        >
        <div class='startTime'>
          <span class='txt'>{{liveDetail.expectedStartTime * 1000 | date('MMMDo HH:mm')}} 直播开始</span>
        </div>
        <div class='message' ref="message">
          <live-message
            v-for='(item, index) in list'
            :key='index'
            :audioList='audioList'
            :messageData='item'
            :isNeedRead='!liveDetail.isTutor'
            :isNeedEnd='!liveDetail.isTutor'
            ref="messageItem"
            @curPlayMusic='curPlayMusic'
            @nextMusic='nextMusic'
          ></live-message>
        </div>
        <div class='endTime' v-if="liveDetail.status === 3">
          <span class='txt'>{{liveDetail.endTime * 1000 | date('MMMDo HH:mm')}} 直播结束</span>
        </div>
      </scroller>
      <div class="scrollBtn" v-if="liveDetail.status !== 1 && list.length > 0">
        <i class="btn" @click.stop="scrollTo('top')"><img src="@a/icon/live_btn_gotop@3x.png" alt=""></i>
        <i class="btn" @click.stop="scrollTo('bottom')"><img src="@a/icon/live_btn_gobase@3x.png" alt=""></i>
      </div>
      <!-- 返回当前播放音频的位置 -->
      <div class="audioPos" @click.stop="jumpAudio" v-if="!liveDetail.isTutor">
        <span>回到播放位置</span>
        <i class="icon"></i>
      </div>
    </div>
    <!-- 普通学员操作权限 -->
    <template v-if="!liveDetail.isTutor">
      <div class='footer'>
        <div class='txtBar'>
          <input class='bar' v-focus type='text' v-model='problemTxt' placeholder='请输入你的问题'>
        </div>
        <div class='submit' @click.stop='putQuestions'>提问</div>
        <div class="area icon iconfont icon-btn_comment" @click.stop="openArea = true"></div>
      </div>
    </template>
    <!-- 导师操作权限 直播未开始-->
    <template v-if="liveDetail.isTutor && liveDetail.status === 1">
      <xButton class="startLiveBtn" @click.stop.native="startLive">点击开始直播</xButton>
    </template>
    <!-- 导师操作权限 直播进行中-->
    <template v-if="liveDetail.isTutor && liveDetail.status === 2">
      <div class="sendArea">
        <div class="operArea">
          <span @click.stop="tutorOper('text')"><i class="icon iconfont icon-icon_writing" :class="{'curOperType': curOperType === 'text'}"></i></span>
          <span @click.stop="tutorOper('audio')"><i class="icon iconfont icon-btn_record" :class="{'curOperType': curOperType === 'audio'}"></i></span>
          <span @click="tutorOper('img')">
            <i class="icon iconfont icon-btn_photo"></i>
            <upLoadFile
             class="upLoadImg"
             attach_type="img"
             :count='1'
             @upLoadResult="upLoadResult"
            >
            </upLoadFile>
          </span>
          <span @click.stop="tutorOper('answer')">
            <i class="icon icon4 iconfont icon-icon_mymeaasage" :class="{'red': newMsgCount > 0}" :data-num="newMsgCount"></i> <!-- red:data-num="1" -->
          </span>
        </div>
        <div class="typeBox">
          <div class="textType" v-show="curOperType === 'text'">
            <botInput @sendMsg="sendMsg" ref="botInput"></botInput>
          </div>
          <div class="audioType" v-show="curOperType === 'audio'">
            <recorder @upload-success="upLoadResult"></recorder>
          </div>
        </div>
      </div>
    </template>
    <!-- 导师操作权限 直播已结束-->
    <template v-if="liveDetail.isTutor && liveDetail.status === 3">
      <xButton class="startLiveBtn" @click.stop.native="openArea = true">
        <p class="enter"><span :class="{'red': newMsgCount > 0}">进入问答区</span></p>
        <p class="number"><span>直播共收到{{liveDetail.problemCount}}条提问</span></p>
      </xButton>
    </template>
    <!-- 问答区 -->
    <questionArea :show="openArea" :questionData="problemInfo"  @closeArea="_closeArea" v-if="!liveDetail.isTutor"></questionArea>
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
import { userInfoApi } from '@/api/pages/center'
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
      problemInfo: null, // 自己造的提问message, 用于列表展示
      userInfoBase: null, // 用户基础信息
      openArea: false,
      isPulldown: true, // 是否开启下拉
      isPullup: true, // 是否开启上拉
      audioList: [], // 音频列表
      curPlayIndex: 0, // 当前正在播放的音频序号
      curOperType: null, // 导师选择发布的类型
      fileId: null, // 导师发布的附件id
      scrollerHeight: null, // 用于计算scroller的高度
      newMsgCount: 0 // 新提问数量
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.global.userInfo,
      wsStatus: state => state.websocket.wsStatus,
      sendData: state => state.websocket.sendData,
      onlineNum: state => state.websocket.onlineNum
    }),
    moreThanThree () {
      // 直播结束超过三天不给提问
      if (this.liveDetail.status === 3 && new Date().getTime() - this.liveDetail.endTime * 1000 > 3 * 3600 * 1000) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    list () {},
    wsStatus () {},
    liveDetail () {
      if (this.liveDetail.status === 2) {
        this.isPullup = false
      }
    },
    audioList (val) {},
    sendData () {},
    openArea (val) {
      if (val) this.newMsgCount = 0
    }
  },
  methods: {
    ...mapActions([
      'updata_sendData',
      'updata_onlineNum',
      'updata_userInfo'
    ]),
    async getUserInfo () {
      if (!this.userInfo) {
        let res = await userInfoApi()
        this.userInfoBase = res.data.base
        this.updata_userInfo(res.data)
      } else {
        this.userInfoBase = this.userInfo.base
      }
    },
    upLoadResult (e) {
      console.log(e, '上传后获取的文件')
      this.fileId = e[e.length - 1].id
      this.sendMsg()
    },
    jumpMore () {
      this.$router.push(`/liveDetail?id=${this.id}&isIntroduce=true`)
    },
    tutorOper (type) {
      this.curOperType = type
      // 计算scroll的高度方便重新渲染高度和操作栏的显示
      setTimeout(() => {
        this.scrollerHeight = this.$refs.main.childNodes[0].clientHeight + 'px'
      }, 300)
      if (type === 'text') {
        setTimeout(() => {
          this.$refs.botInput.$refs.input.focus()
        }, 100)
        setTimeout(() => {
          document.body.scrollTop = document.body.scrollHeight
        }, 300)
      }
      if (type === 'audio') {
      }
      if (type === 'answer') {
        this.openArea = true
      }
    },
    sendMsg (tutorTxt) {
      this.option.type = this.curOperType
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
      this.newMsgCount = res.data.newProblemCount
      this.option.teacherId = res.data.masterUid
      // 直播进行中才可以加入直播
      if (this.liveDetail.status === 2) {
        this.creatWs()
      }
      // 直播已开始才要获取历史消息记录
      if (this.liveDetail.status !== 1) {
        this.getMessage({isFirst: true, action: 1}).then(res => {
          // 没有数据的时候关闭下拉加载
          if (res.data.length === 0) {
            this.isPulldown = false
          }
        })
      }
    },
    getMessage ({msgId, action, needLoading = true, isFirst = false}) {
      let data = {
        id: this.id,
        action: action,
        msgId: msgId,
        count: 20
      }
      return getLiveRoomMsgApi(data, needLoading).then(res => {
        if (action === 1) {
          this.list = this.list.concat(res.data)
        } else {
          this.list = res.data.concat(this.list)
        }
        this.list.forEach((item, index) => {
          if (item.type === 'audio') {
            item.index = index
            this.audioList.push(item)
          }
        })
        if (isFirst) {
          this.$nextTick(() => {
            if (this.liveDetail.status === 2) {
              setTimeout(() => {
                this.$refs.scroll.scrollBottom()
              }, 300)
            }
          })
        }
        return res
      })
    },
    nextMusic (index) {
      this.curPlayIndex = index
      this.$refs.messageItem[index].$children[0].play()
    },
    curPlayMusic (index) {
      this.curPlayIndex = index
    },
    jumpAudio () {
      let index = this.audioList[this.curPlayIndex].index
      this.$refs.scroll.scrollToElement(this.$refs.message.getElementsByClassName('live-message')[index])
    },
    loadPrev () {
      if (this.isPulldown && this.list.length > 0 && this.list[0].messageId) {
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
      if (this.isPullup && this.list.length > 0 && this.list[this.list.length - 1].messageId) {
        this.getMessage({msgId: this.list[this.list.length - 1].messageId, action: 1, needLoading: false}).then(res => {
          this.$refs.scroll.pullupUi = false
          if (res.data.length === 0) {
            this.isPullup = false
          }
        })
      }
    },
    putQuestions () {
      if (this.moreThanThree) {
        this.$toast({
          text: '<p>直播结束超过三天，</p><p>不允许提问！</p>',
          type: 'text',
          width: '10em'
        })
        return
      }
      if (this.problemTxt !== '') {
        return new Promise((resolve, reject) => {
          let data = {
            live_id: this.id,
            master_uid: this.option.teacherId,
            content: this.problemTxt
          }
          putQuestionsApi(data).then(res => {
            this.$toast({
              text: '提交成功',
              type: 'success',
              callBack: () => {
                let data = {
                  avatar: this.userInfo.base.avatar,
                  createdAt: parseInt(new Date().getTime() / 1000),
                  realname: this.userInfo.base.realname,
                  messageId: new Date().getTime(),
                  content: this.problemTxt,
                  type: 'text'
                }
                this.problemInfo = data
                this.openArea = true
                this.problemTxt = ''
              }
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
    creatWs () {
      // 断线重连 还要重新加入直播间
      let company = localstorage.get('XPLUSCompany') || settings.defaultCompany
      let websocketUrl = settings.websocketUrl
      ws.create(`${websocketUrl}/${company}`)
    },
    closeWs (isReConnect) {
      ws.close(isReConnect)
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
        content: '<p class="left">1.直播结束后，不可以继续更新内容 </p><p class="left">2.直播结束3天后，不会再收到学员的提问，但可以回答学员的问题</p>',
        confirmBack: () => {
          if (!this.liveDetail.isTutor) return
          let data = {
            liveId: this.id,
            status: 3
          }
          putUpdataLiveApi(data).then(res => {
            this.liveDetail.status = 3
            this.liveDetail.endTime = new Date().getTime()
          })
        }
      })
    },
    startLive () {
      this.$confirm({
        title: '开始直播',
        content: '<p class="left">1.开始直播后，可发送语音、文字、图片内容</p><p class="left">2.开始直播后，所有学员都可进入直播间</p><p class="left">3.在顶部栏右上角，点击结束按钮可结束直播</p>',
        confirmBack: () => {
          if (!this.liveDetail.isTutor) return
          let data = {
            liveId: this.id,
            status: 2
          }
          putUpdataLiveApi(data).then(res => {
            this.liveDetail.status = 2
            this.liveDetail.expectedStartTime = new Date().getTime()
            this.creatWs() // 开启直播
          })
        }
      })
    }
  },
  created () {
    let {id, openArea} = this.$route.query
    this.id = id
    if (openArea) this.openArea = true
    this.getDetail()
    this.getUserInfo()
  },
  mounted () {
    let that = this
    // 直播消息回调
    onMessage = (obj) => {
      let data = obj.detail
      // 登录和退出登录逻辑
      if (data.hasOwnProperty('cmd')) {
        switch (data.cmd) {
          case 'login.token':
            that.addLive()
            break
        }
      // 接收信息处理
      } else if (data.hasOwnProperty('msgType')) {
        switch (data.msgType) {
          // 接收他人的信息
          case 'live_msg':
            that.list.push(data.data)
            that.$refs.scroll.scrollBottom('liveMsg')
            if (data.data.type === 'audio') {
              data.data.index = that.audioList[that.audioList.length - 1].index + 1
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
          case 'live_problem_count':
            that.newMsgCount = data.data.count
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
    this.closeWs(false) // 关闭ws
    this.leaveLive() // 退出直播间
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
        color: #22292C;
        line-height: 19px;
        .setEllipsis(50%);
        .icon {
          font-size: 24px; /*px*/
          color: #dcdcdc;
          vertical-align: 2px;
        }
      }
      .msg {
        font-size: 24px; /*px*/
        font-weight: 300;
        line-height: 16px;
        color: #929292;
        margin-top: 2px;
        .status {
          margin-right: 9px;
          margin-bottom: 2px;
          position: relative;
          display: inline-block;
          line-height: 12px;
          &.green::before {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #0FD685;
            content: '';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
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
            transform: translateY(-50%);
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
        .icon-me_icon_edit_chevron {
          font-size: 24px; /*px*/
          color: rgba(220, 220, 220, 1);
          margin-left: -2px;
        }
      }
      .end {
        width: 29px;
        height: 29px;
        background: #F8F8F8;
        border: 1px solid rgba(220,220,220,1);
        position: absolute;
        top: 50%;
        margin-top: -14.5px;
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
      .icon-me_icon_edit_chevron {
        font-size: 23px; /*px*/
        float: right;
        color: #ff6666;
      }
    }
    .main {
      width: 100%;
      height: 100vh;
      padding: 52px 0;
      box-sizing: border-box;
      margin-top: -52px;
      &.text {
        padding-bottom: 100px;
      }
      &.audio {
        padding-bottom: 208px;
      }
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
      .audioPos {
        width: 110px;
        height: 36px;
        padding: 0 10px 0 15px;
        position: fixed;
        bottom: 81px;
        right: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 24px; /*px*/
        color: #929292;
        font-weight: 300;
        box-sizing: border-box;
        background: #fff;
        border-radius: 50px 0 0 50px;
        box-shadow: 0px 10px 20px 0px rgba(200,200,200,0.1);
        .icon {
          .setTriangle()
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
        padding: 0 15px;
        .bar {
          width: 100%;
          height: 100%;
          display: block;
          color: #354048;
          font-size: 30px; /*px*/
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
      .area {
        font-size: 40px; /*px*/
        color: #D7AB70;
        padding: 0 20px 0 19px;
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
        height: 52px;
        box-sizing: border-box;
        display: flex;
        > span {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          .icon {
            font-size: 44px; /*px*/
            color: rgb(53, 64, 72);
          }
          .red {
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
    .startLiveBtn {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 52px;
      .enter, .number {
        color: #354048;
        font-size: 30px; /*px*/
        line-height: 19px;
        &.number {
          font-size: 24px; /*px*/
        }
        > span {
          &.red {
            position: relative;
            &::after {
              content: '';
              width: 7px;
              height: 7px;
              background: #FF4949;
              position: absolute;
              border-radius: 50%;
              top: 0px;
              right: -7px;
              display: block;
            }
          }
        }
      }
    }
  }
</style>