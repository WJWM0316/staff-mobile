<template>
  <div class='wrap'>
    <div class='header'>
      <p class='title'>教你如何高效记单词</p>
      <p class='msg'>
        <span class='status green' v-show="wsStatus === 1">直播进行中</span>
        <span class='status red'  v-show="wsStatus === 0">直播连接中</span>
        <span class='status red'  v-show="wsStatus === 2">直播未连接</span>
        <span class='num'>1人参与</span>
      </p>
      <div class='more'>
        <span>更多介绍</span>
        <i class="icon iconfont icon-list_live_icon_more"></i>
      </div>
    </div>
    <div class="failShow" v-show="wsStatus === 2" @click.stop="creatWs">
      <i class="icon iconfont icon-live_icon_question"></i>
      <div class="txt">连接服务器失败，点击重新连接</div>
      <i class="icon iconfont icon-list_live_icon_more"></i>
    </div>
    <div class="main">
      <scroller class="scroll"
        ref="scroll"
        :pulldown=true
        :pullup=true
        :listenScroll=true
        :list="list"
        downType='loadMore'
        bgColor = '#F9F9F9'
        @pullingDown="loadPrev"
        @pullingUp="loadNext"
        >
        <div class="startTime">
          <span class="txt">7月13日9:30 直播开始</span>
        </div>
        <div class="message">
          <live-message></live-message>
        </div>
        <div class="endTime">
          <span class="txt">7月13日9:30 直播介绍</span>
        </div>
      </scroller>
    </div>
    <div class="footer">
      <div class="txtBar border-1px">
        <input class="bar" type="text" v-model="problemTxt" placeholder="请输入你的问题">
      </div>
      <div class="submit" @click.stop="send(problemTxt)">提问</div>
    </div>
    <div class="testBtn" @click="closeWs">断线测试</div>
  </div>
</template>
<script>
import scroller from '@c/layout/scroller'
import localstorage from '@u/localstorage'
import ws from '@u/websocket'
import liveMessage from '@c/business/liveMessage'
import { mapState } from 'vuex'
let resolveFun = null
export default {
  components: {
    scroller,
    liveMessage
  },
  data () {
    return {
      list: [
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111'
      ],
      problemTxt: '',
      resData: {}
    }
  },
  computed: {
    ...mapState({
      wsStatus: state => state.websocket.wsStatus,
      resolveTime: state => state.websocket.resolveTime,
      resolveData: state => state.websocket.resolveData
    })
  },
  watch: {
    wsStatus () {},
    resolveTime (val) {
      console.log(val)
    },
    resolveData (val) {
      console.log(val)
    }
  },
  methods: {
    loadPrev () {
      setTimeout(() => {
        this.$refs.scroll.pulldownUi = false
        let data = [
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111'
        ]
        this.list = data.concat(this.list)
      }, 2000)
    },
    loadNext () {
      setTimeout(() => {
        this.$refs.scroll.pullupUi = false
        this.list = this.list.concat([
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111',
          '11111111111111111111111111111'
        ])
      }, 2000)
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
  mounted () {
    ws.create('ws://work-api.xplus.ziwork.com/tiger')
    resolveFun = (e) => {
      console.log(e.detail)
    }
    window.addEventListener('wsOnMessage', resolveFun)
  },
  beforeDestroy () {
    window.removeEventListener('wsOnMessage', resolveFun)
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
    top: 30%;
    left: 40%;
    background: red;
  }
  ::-webkit-input-placeholder {
    color: #000;
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
        border-radius: 50px; /*px*/
        background: #F8F8F8;
        flex: 1;
        overflow: hidden;
        &.border-1px::after {
          border-color: rgba(237,237,237,1);
        }
        .bar {
          width: 100%;
          height: 100%;
          display: block;
          color: #354048;
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