<template>
  <div class='questionArea'>
    <div class='areaWrap'>
      <div class='tab border-bottom-1px'>
        <div class="close icon iconfont icon-live_btn_close" @click.stop="closeArea"></div>
        <span
          class='tabItem'
          v-for='(item, index) in tabList'
          :key='index'
          :class="{'selected': tabIndex === index}"
          @click.stop='tabIndex = index'
        >{{item}}</span>
      </div>
      <scroller
        v-show='tabIndex === 0'
        class='scroll'
        ref='scrollPart'
        :pulldown=true
        :pullup="pullup"
        :listenScroll=true
        :freeScroll=true
        :list='scrollPart.list'
        downType='refresh'
        bgColor = '#fff'
        @pullingDown='loadPrev'
        @pullingUp='loadNext'
      >
        <div class='messageWrap'>
          <div class='mine'>
            <liveMessage
              v-for='(item, index) in scrollPart.list'
              :key='index'
              :messageData='item'
              ref='messageItem'
            ></liveMessage>
          </div>
        </div>
      </scroller>
      <!-- <scroller
        v-show='tabIndex === 1'
        class='scrollAll'
        ref='scrollAll'
        :pulldown=true
        :pullup=true
        :listenScroll=true
        :freeScroll=true
        :list='scrollAll.list'
        :noData = 'scrollAll.noData'
        downType ='refresh'
        bgColor = '#F9F9F9'
        @pullingDown='loadPrev'
        @pullingUp='loadNext'
      >
        <liveMessage
          v-for='(item, index) in scrollAll.list'
          :key='index'
          :messageData='item'
          ref='messageItem'
        ></liveMessage>
      </scroller> -->
    </div>
  </div>
</template>
<script>
import scroller from '@c/layout/scroller'
import liveMessage from '@c/business/liveMessage'
export default {
  components: {
    scroller,
    liveMessage
  },
  data () {
    return {
      pullup: true,
      tabIndex: 0,
      tabList: ['已回答', '全部提问'],
      scrollPart: {
        list: [
          {
            avatar: {
              middleUrl: 'http://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/img/2018/0911/18/5b979552b4922.jpg!330xauto'
            },
            content: '大家好！',
            createdAt: '2018-09-19 18:09:04',
            fromUid: 8,
            fromUserName: 'real_井馨予',
            liveId: 44,
            messageId: 1,
            status: 1,
            statusName: '正常',
            type: 'text'
          },
          {
            avatar: {
              middleUrl: 'http://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/img/2018/0911/18/5b979552b4922.jpg!330xauto'
            },
            content: '大家好！',
            createdAt: '2018-09-19 18:09:04',
            fromUid: 8,
            fromUserName: 'real_井馨予',
            liveId: 44,
            messageId: 1,
            status: 1,
            statusName: '正常',
            type: 'text'
          },
          {
            avatar: {
              middleUrl: 'http://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/img/2018/0911/18/5b979552b4922.jpg!330xauto'
            },
            content: '大家好！',
            createdAt: '2018-09-19 18:09:04',
            fromUid: 8,
            fromUserName: 'real_井馨予',
            liveId: 44,
            messageId: 1,
            status: 1,
            statusName: '正常',
            type: 'text'
          },
          {
            avatar: {
              middleUrl: 'http://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/img/2018/0911/18/5b979552b4922.jpg!330xauto'
            },
            content: '大家好！',
            createdAt: '2018-09-19 18:09:04',
            fromUid: 8,
            fromUserName: 'real_井馨予',
            liveId: 44,
            messageId: 1,
            status: 1,
            statusName: '正常',
            type: 'text'
          },
          {
            avatar: {
              middleUrl: 'http://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/img/2018/0911/18/5b979552b4922.jpg!330xauto'
            },
            content: '大家好！',
            createdAt: '2018-09-19 18:09:04',
            fromUid: 8,
            fromUserName: 'real_井馨予',
            liveId: 44,
            messageId: 1,
            status: 1,
            statusName: '正常',
            type: 'text'
          },
          {
            avatar: {
              middleUrl: 'http://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/img/2018/0911/18/5b979552b4922.jpg!330xauto'
            },
            content: '大家好！',
            createdAt: '2018-09-19 18:09:04',
            fromUid: 8,
            fromUserName: 'real_井馨予',
            liveId: 44,
            messageId: 1,
            status: 1,
            statusName: '正常',
            type: 'text'
          },
          {
            avatar: {
              middleUrl: 'http://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/img/2018/0911/18/5b979552b4922.jpg!330xauto'
            },
            content: '大家好！',
            createdAt: '2018-09-19 18:09:04',
            fromUid: 8,
            fromUserName: 'real_井馨予',
            liveId: 44,
            messageId: 1,
            status: 1,
            statusName: '正常',
            type: 'text'
          },
          {
            avatar: {
              middleUrl: 'http://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/img/2018/0911/18/5b979552b4922.jpg!330xauto'
            },
            content: '大家好！',
            createdAt: '2018-09-19 18:09:04',
            fromUid: 8,
            fromUserName: 'real_井馨予',
            liveId: 44,
            messageId: 1,
            status: 1,
            statusName: '正常',
            type: 'text'
          },
          {
            avatar: {
              middleUrl: 'http://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/img/2018/0911/18/5b979552b4922.jpg!330xauto'
            },
            content: '大家好！',
            createdAt: '2018-09-19 18:09:04',
            fromUid: 8,
            fromUserName: 'real_井馨予',
            liveId: 44,
            messageId: 1,
            status: 1,
            statusName: '正常',
            type: 'text'
          },
          {
            avatar: {
              middleUrl: 'http://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/img/2018/0911/18/5b979552b4922.jpg!330xauto'
            },
            content: '大家好！',
            createdAt: '2018-09-19 18:09:04',
            fromUid: 8,
            fromUserName: 'real_井馨予',
            liveId: 44,
            messageId: 1,
            status: 1,
            statusName: '正常',
            type: 'text'
          },
          {
            avatar: {
              middleUrl: 'http://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/img/2018/0911/18/5b979552b4922.jpg!330xauto'
            },
            content: '大家好！',
            createdAt: '2018-09-19 18:09:04',
            fromUid: 8,
            fromUserName: 'real_井馨予',
            liveId: 44,
            messageId: 1,
            status: 1,
            statusName: '正常',
            type: 'text'
          },
          {
            avatar: {
              middleUrl: 'http://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/img/2018/0911/18/5b979552b4922.jpg!330xauto'
            },
            content: '大家好！',
            createdAt: '2018-09-19 18:09:04',
            fromUid: 8,
            fromUserName: 'real_井馨予',
            liveId: 44,
            messageId: 1,
            status: 1,
            statusName: '正常',
            type: 'text'
          },
          {
            avatar: {
              middleUrl: 'http://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/img/2018/0911/18/5b979552b4922.jpg!330xauto'
            },
            content: '大家好！',
            createdAt: '2018-09-19 18:09:04',
            fromUid: 8,
            fromUserName: 'real_井馨予',
            liveId: 44,
            messageId: 1,
            status: 1,
            statusName: '正常',
            type: 'text'
          },
          {
            avatar: {
              middleUrl: 'http://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/img/2018/0911/18/5b979552b4922.jpg!330xauto'
            },
            content: '大家好！',
            createdAt: '2018-09-19 18:09:04',
            fromUid: 8,
            fromUserName: 'real_井馨予',
            liveId: 44,
            messageId: 1,
            status: 1,
            statusName: '正常',
            type: 'text'
          },
          {
            avatar: {
              middleUrl: 'http://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/img/2018/0911/18/5b979552b4922.jpg!330xauto'
            },
            content: '大家好！',
            createdAt: '2018-09-19 18:09:04',
            fromUid: 8,
            fromUserName: 'real_井馨予',
            liveId: 44,
            messageId: 1,
            status: 1,
            statusName: '正常',
            type: 'text'
          }
        ],
        noData: false
      },
      scrollAll: {
        list: [],
        noData: false
      }
    }
  },
  methods: {
    loadPrev () {
      setTimeout(res => {
        this.$refs.scrollPart.pulldownUi = false
      }, 1000)
    },
    loadNext () {
      setTimeout(res => {
        this.$refs.scrollPart.pullupUi = false
      }, 1000)
    },
    closeArea () {
      this.$emit('closeArea')
    }
  }
}
</script>
<style lang='less' scoped>
  .questionArea {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-top: 28px;
    background: rgba(0, 0, 0, 0.7);
    box-sizing: border-box;
    overflow: hidden;
    z-index: 3;
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
        .icon-live_btn_close {
          position: absolute;
          font-size: 26px; /*px*/
          color: #BCBCBC;
          top: 15px;
          right: 15px;
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
      .scroll {
        width: 100%;
        height: 100%;
        .messageWrap {
          padding: 20px 0 0;
        }
      }
    }
  }
</style>