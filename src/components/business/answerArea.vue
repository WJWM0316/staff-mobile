<template>
  <div v-if="show">
    <div class='questionArea'>
      <div class='areaWrap'>
        <div class='tab border-bottom-1px'>
          <div class="icon iconfont icon-me_icon_edit_chevron" @click.stop="closeArea"></div>
          <span
            class='tabItem'
            v-for='(item, index) in tabList'
            :key='index'
            :class="{'selected': tabIndex === index}"
            @click.stop='choseTab(index)'
          >{{item}}</span>
        </div>
        <div class='messageWrap' v-show='tabIndex === 0'>
          <scroller
            class='scroll'
            ref='scrollPart'
            :pulldown=true
            :pullup="pullup"
            :listenScroll=true
            :freeScroll=true
            :noData="scrollPart.noData"
            :scrollY = 'isScrollY'
            :list='scrollPart.list'
            downType='refresh'
            bgColor = '#fff'
            @pullingDown='loadPrev'
            @pullingUp='loadNext'
            @touchstart.native = 'touchScroll'
          >
            <div class='mine'>
              <div class="block border-bottom-1px" v-for='(item, index) in scrollPart.list' :key="index">
                <div class="time">{{item.problemInfo.createdAt * 1000 | activeTime}}</div>
                <liveMessage
                  class="msg"
                  :messageData='item.problemInfo'
                  bgColor="#F8F8F8"
                  ref='messageItem'
                ></liveMessage>
                <div class="answerBtn" @click.stop="openFun(item.problemInfo)">回答</div>
              </div>
            </div>
            <noDataShow v-if="scrollPart.list.length === 0"></noDataShow>
          </scroller>
        </div>
        <div class="messageWrap" v-show='tabIndex === 1'>
          <scroller
            class='scroll'
            ref='scrollAll'
            :pulldown=true
            :pullup=true
            :listenScroll=true
            :freeScroll=true
            :list='scrollAll.list'
            :noData = 'scrollAll.noData'
            :scrollY = 'isScrollY'
            downType ='refresh'
            bgColor = '#ffffff'
            @pullingDown='loadPrev'
            @pullingUp='loadNext'
            @touchstart.native = 'touchScroll'
          >
            <div class="block border-bottom-1px" v-for='(item, index) in scrollAll.list' :key="index">
              <div class="time">
                <span>{{item.problemInfo.createdAt | activeTime}}</span></div>
              <liveMessage
                class="msg"
                v-if="item.problemInfo"
                :messageData='item.problemInfo'
                bgColor="#F8F8F8"
                ref='messageItem'
              ></liveMessage>
              <liveMessage
                class="msg"
                v-if="item.answerInfo"
                :messageData='item.answerInfo'
                bgColor="#FFF5CA"
                ref='messageItem'
              ></liveMessage>
              <div class="answerBtn" v-if="!item.status" @click.stop="openFun(item.problemInfo)">回答</div>
            </div>
            <noDataShow v-if="scrollAll.list.length === 0"></noDataShow>
          </scroller>
        </div>
        <div class="sendArea" v-if="openArea">
          <div class="inner">
            <div class="operArea">
              <span class="msg" v-if="choseMessage">回答：{{choseMessage.realname}}</span>
              <div class="btn">
                <i @click.stop="sendType = 'text'" class="icon1 iconfont icon-icon_writing" :class="{'curOperType': sendType === 'text'}"></i>
                <i @click.stop="sendType = 'audio'" class="icon2 iconfont icon-btn_record" :class="{'curOperType': sendType === 'audio'}"></i>
              </div>
            </div>
            <div class="textType" v-show="sendType === 'text'">
              <botInput @sendMsg="sendMsg" ref="botInput"></botInput>
            </div>
            <div class="audioType" v-show="sendType === 'audio'">
              <recorder @upload-success="upLoadResult"></recorder>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import scroller from '@c/layout/scroller'
import liveMessage from '@c/business/liveMessage'
import botInput from '@c/layout/botInput'
import recorder from '@c/functional/recorder'
import { getAnswerListApi, putAnswerApi } from '@/api/pages/live'
export default {
  components: {
    scroller,
    liveMessage,
    botInput,
    recorder
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    tutorInfo: { // 回答的导师信息用来前端展示
      type: Object,
      default: null
    }
  },
  watch: {
    scrollPart () {},
    openArea (val) {
      if (val) this.isScrollY = false
    }
  },
  data () {
    return {
      pullup: true,
      tabIndex: 0,
      tabList: ['未回答', '全部提问'],
      sendType: 'text', // 回答类型
      openArea: false, // 回答区域
      option: { // 回答信息
        type: null,
        content: '',
        problem_id: null,
        live_id: this.$route.query.id,
        answerInfo: this.tutorInfo // 导师信息用来前端展示
      },
      fileId: null, // 音频id
      isScrollY: true, // 回答问题时禁止滚动
      choseMessage: null, // 当前选择的消息
      scrollPart: {
        list: [],
        page: 0,
        noData: false
      },
      scrollAll: {
        list: [],
        page: 0,
        noData: false
      }
    }
  },
  methods: {
    loadPrev () {
      if (this.tabIndex === 0) {
        this.scrollPart.list = []
        this.scrollPart.page = 0
        this.getList({type: 'my'}, false).then(res => {
          this.$refs.scrollPart.pulldownUi = false
        })
      } else {
        this.scrollAll.list = []
        this.scrollAll.page = 0
        this.getList({type: 'all'}, false).then(res => {
          this.$refs.scrollAll.pulldownUi = false
        })
      }
    },
    loadNext () {
      if (this.tabIndex === 0) {
        this.$refs.scrollPart.pullupUi = true
        this.getList({type: 'my'}, false).then(res => {
          this.$refs.scrollPart.pullupUi = false
        })
      } else {
        this.$refs.scrollAll.pullupUi = true
        this.getList({type: 'all'}, false).then(res => {
          this.$refs.scrollAll.pullupUi = false
        })
      }
    },
    touchScroll (e) {
      if (e.target.className === 'answerBtn') {
        this.openArea = true
      } else {
        this.openArea = false
      }
    },
    getList ({type}, needLoading) {
      return new Promise((resolve, reject) => {
        let page
        let data = {
          live_id: this.$route.query.id,
          type: type
        }
        if (type === 'my') {
          this.scrollPart.page++
          data.page = this.scrollPart.page
        } else {
          this.scrollAll.page++
          data.page = this.scrollAll.page
        }
        getAnswerListApi(data, needLoading).then(res => {
          resolve(res)
          if (type === 'my') {
            this.scrollPart.list = this.scrollPart.list.concat(res.data)
            if (res.meta.currentPage === res.meta.lastPage) {
              this.scrollPart.noData = true
            }
          } else {
            // 没有下一页就返回空
            this.scrollAll.list = this.scrollAll.list.concat(res.data)
            if (res.meta.currentPage === res.meta.lastPage) {
              this.scrollAll.noData = true
            }
          }
        })
      })
    },
    openFun (item) {
      this.openArea = true
      this.choseMessage = item
      this.$refs.botInput.$refs.input.focus()
      setTimeout(() => {
        document.body.scrollTop = document.body.scrollHeight
      }, 300)
    },
    closeArea () {
      this.$emit('closeArea')
    },
    upLoadResult (e) {
      console.log(e, '上传后获取的文件')
      this.fileId = e[0].id
      this.option.answerInfo.file = {
        url: e.url,
        duration: e.duration
      }
      this.sendMsg()
    },
    sendMsg (tutorTxt) {
      this.option.problem_id = this.choseMessage.messageId
      if (this.sendType === 'text') {
        this.option.type = 1
        this.option.answerInfo.type = 'text'
        this.option.content = tutorTxt
      } else {
        this.option.type = 2
        this.option.answerInfo.type = 'audio'
        this.option.content = this.fileId
      }
      putAnswerApi(this.option, false).then(res => {
        this.scrollPart.list.forEach((item, index) => {
          if (item.problemInfo.messageId === this.option.problem_id) {
            this.openArea = false
            this.scrollPart.list.splice(index, 1)
          }
        })
        this.scrollAll.list.forEach((item, index) => {
          if (item.problemInfo.messageId === this.option.problem_id) {
            this.option.answerInfo.createdAt = new Date().getTime()
            if (this.option.answerInfo.type === 'text') {
              this.option.answerInfo.content = tutorTxt
            }
            let data = this.scrollAll.list[index]
            this.option.answerInfo.avatar = this.option.answerInfo.masterAvatar
            this.option.answerInfo.messageId = res.data.messageId
            data.answerInfo = this.option.answerInfo
            console.log(data.answerInfo)
            data.status = 1
            this.openArea = false
            this.scrollAll.list.splice(index, 1, data)
          }
        })
      })
    },
    choseTab (index) {
      this.tabIndex = index
      this.openArea = false
      if (index === 1 && this.scrollAll.list.length === 0) {
        this.getList({page: 1, type: 'all'})
      }
    }
  },
  created () {
    this.getList({page: 1, type: 'my'})
  }
}
</script>
<style lang='less' scoped>
  .questionArea {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    z-index: 3;
    position: fixed;
    top: 0;
    left: 0;
    .areaWrap {
      width: 100%;
      height: 100%;
      background: #fff;
      border-radius: 13px 13px 0px 0px;
      overflow: hidden;
      padding-top: 44px;
      box-sizing: border-box;
      position: relative;
      .tab {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        height: 44px;
        text-align: center;
        .icon-me_icon_edit_chevron {
          position: absolute;
          font-size: 30px; /*px*/
          color: #BCBCBC;
          top: 50%;
          left: 17px;
          transform: translateY(-50%) rotate(180deg);
        }
        .tabItem {
          line-height: 44px;
          font-size: 32px; /*px*/
          font-weight: 300;
          color: #929292;
          display: inline-block;
          margin: 0 14px;
          &.selected {
            color: #354048;
            font-weight: 600;
            position: relative;
            &::after {
              content: '';
              width: 37px;
              height: 3px;
              background: #FFE266;
              position: absolute;
              left: 50%;
              margin-left: -18.5px;
              bottom: 0;
            }
          }
        }
      }
      .messageWrap {
        width: 100%;
        height: 100%;
        .scroll {
          width: 100%;
          height: 100%;
        }
        .title {
          padding: 20px 20px 0;
          font-size: 28px; /*px*/
          font-weight: 300;
          line-height: 14px;
          color: #354048;
        }
        .block {
          padding: 35px 0 15px;
          position: relative;
          .time {
            position: absolute;
            top: 15px;
            right: 16px;
            font-size: 24px; /*px*/
            color: #666666;
            font-weight: 300;
            line-height: 12px;
          }
          .answerBtn {
            position: absolute;
            padding: 4px 14px;
            font-size: 26px; /*px*/
            line-height: 16px;
            color: #4080AD;
            border-radius: 2px;
            border: 1px solid #4080AD;
            bottom: 16px;
            right: 20px;
          }
          .msg:last-child {
            padding-bottom: 0;
          }
        }
      }
      .sendArea {
        position: fixed;
        width: 100%;
        // height: 100%;
        bottom: 0;
        left: 0;
        .innerBg {
          position: absolute;
          height: 100%;
          width: 100%;
          z-index: 1;
        }
        .inner {
          position: absolute;
          width: 100%;
          bottom: 0;
          left: 0;
          background-color: #fff;
          z-index: 2;
          .operArea {
            padding: 0 22px;
            box-sizing: border-box;
            height: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0px 1px 0px 0px rgba(237,237,237,1),0px -1px 0px 0px rgba(237,237,237,1);
            .msg {
              font-size: 28px; /*px*/
              font-weight: 300;
            }
            .btn {
              .icon1 {
                color: rgb(53, 64, 72);
                font-size: 17px;
                margin-right: 40px;
                display: block;
                float: left;
                &.curOperType {
                  color: #D7AB70;
                }
              }
              .icon2 {
                color: rgb(53, 64, 72);
                font-size: 20px;
                display: block;
                float: right;
                &.curOperType {
                  color: #D7AB70;
                }
              }
            }
          }
        }
      }
    }
  }
</style>