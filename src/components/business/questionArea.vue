<template>
  <Popup v-model="show" position='bottom' height="100%">
    <div class='questionArea'>
      <div class='areaWrap'>
        <div class='tab border-bottom-1px'>
          <div class="close icon iconfont icon-live_btn_close" @click.stop="closeArea"></div>
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
            :list='scrollPart.list'
            downType='refresh'
            bgColor = '#fff'
            @pullingDown='loadPrev'
            @pullingUp='loadNext'
          >
            <div class='mine' v-if="scrollPart.myListLength > 0">
              <div class="title">我的提问</div>
              <div class="block border-bottom-1px" v-for='(item, index) in scrollPart.list' :key="index" v-if="scrollPart.myListLength > index">
                <div class="time">
                  <span v-if="item.answerInfo">{{item.answerInfo.createdAt * 1000 | activeTime}}</span>
                  <span v-else>{{item.problemInfo.createdAt * 1000 | activeTime}}</span></div>
                <liveMessage
                  class="msg"
                  :messageData='item.problemInfo'
                  bgColor="#F8F8F8"
                  ref='messageItem'
                ></liveMessage>
                <liveMessage
                  class="msg"
                  :messageData='item.answerInfo'
                  bgColor="#FFF5CA"
                  ref='messageItem'
                ></liveMessage>
              </div>
            </div>
            <div class="other" v-if="scrollPart.list.length > scrollPart.myListLength">
              <div class="title">其他已回答提问</div>
              <div class="block border-bottom-1px" v-for='(item, index) in scrollPart.list' :key="index" v-if="scrollPart.myListLength - 1 < index">
                <div class="time"><span v-if="item.answerInfo">{{item.answerInfo.createdAt * 1000 | activeTime}}</span><span v-else>{{item.problemInfo.createdAt * 1000 | activeTime}}</span></div>
                <liveMessage
                  class="msg"
                  :messageData='item.problemInfo'
                  bgColor="#F8F8F8"
                  ref='messageItem'
                ></liveMessage>
                <liveMessage
                  class="msg"
                  :messageData='item.answerInfo'
                  bgColor="#FFF5CA"
                  ref='messageItem'
                ></liveMessage>
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
            downType ='refresh'
            bgColor = '#ffffff'
            @pullingDown='loadPrev'
            @pullingUp='loadNext'
          >
            <div class="block border-bottom-1px" v-for='(item, index) in scrollAll.list' :key="index">
              <div class="time">
                <span v-if="item.answerInfo">{{item.answerInfo.createdAt | activeTime}}</span>
                <span v-else>{{item.problemInfo.createdAt | activeTime}}</span></div>
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
            </div>
            <noDataShow v-if="scrollAll.list.length === 0"></noDataShow>
          </scroller>
        </div>
      </div>
    </div>
  </Popup>
</template>
<script>
import scroller from '@c/layout/scroller'
import liveMessage from '@c/business/liveMessage'
import { Popup } from 'vux'
import { getProblemListApi } from '@/api/pages/live'
export default {
  components: {
    scroller,
    liveMessage,
    Popup
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    questionData: {
      type: Object,
      default: () => {
        return {
          answerInfo: null,
          problemInfo: null,
          status: 0
        }
      }
    }
  },
  data () {
    return {
      pullup: true,
      tabIndex: 0,
      tabList: ['已回答', '全部提问'],
      scrollPart: {
        list: [],
        myListLength: 0,
        myPage: 1,
        otherPage: 1,
        noData: false,
        myComplete: false // 我的是否都加载完毕
      },
      scrollAll: {
        list: [],
        page: 1,
        noData: false
      }
    }
  },
  watch: {
    questionData (val) {
      console.log(val, 111111111)
      if (this.scrollPart.list.length > 0) {
        this.scrollPart.list.unshift(val)
        this.scrollAll.list.unshift(val)
      }
    },
    show (val) {
      if (val && this.scrollPart.list.length === 0) {
        this.getList({page: 1, type: 'my'})
      }
    }
  },
  methods: {
    loadPrev () {
      if (this.tabIndex === 0) {
        this.scrollPart.list = []
        this.getList({page: 1, type: 'my'}, false).then(res => {
          this.$refs.scrollPart.pulldownUi = false
        })
      } else {
        this.scrollAll.list = []
        this.getList({page: 1, type: 'all'}, false).then(res => {
          this.$refs.scrollAll.pulldownUi = false
        })
      }
    },
    loadNext () {
      if (this.tabIndex === 0) {
        this.$refs.scrollPart.pullupUi = true
        if (!this.scrollPart.myComplete) {
          this.scrollPart.myPage++
          this.getList({page: this.scrollPart.myPage, type: 'my'}, false).then(res => {
            this.$refs.scrollPart.pullupUi = false
          })
        } else {
          this.scrollPart.otherPage++
          this.getList({page: this.scrollPart.otherPage, type: 'other'}, false).then(res => {
            this.$refs.scrollPart.pullupUi = false
          })
        }
      } else {
        this.scrollAll.page++
        this.$refs.scrollAll.pullupUi = true
        this.getList({page: this.scrollAll.page, type: 'all'}, false).then(res => {
          this.$refs.scrollAll.pullupUi = false
        })
      }
    },
    getList ({page = 1, count = 20, type}, needLoading) {
      return new Promise((resolve, reject) => {
        let data = {
          live_id: this.$route.query.id,
          page: page || 1,
          count: count || 20,
          type: type
        }
        getProblemListApi(data, needLoading).then(res => {
          resolve(res)
          if (type === 'my') {
            this.scrollPart.list = this.scrollPart.list.concat(res.data)
            // 没有下一页数据的话加载下一部分的数据
            if (res.meta.currentPage === res.meta.lastPage) {
              this.scrollPart.myListLength = this.scrollPart.list.length
              this.scrollPart.myComplete = true
              this.getList({page: 1, type: 'other'})
            }
          } else if (type === 'other') {
            this.scrollPart.list = this.scrollPart.list.concat(res.data)
            // 没有下一页就返回空
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
    closeArea () {
      this.$emit('closeArea')
    },
    choseTab (index) {
      this.tabIndex = index
      if (index === 1 && this.scrollAll.list.length === 0) {
        this.getList({page: 1, type: 'all'})
      }
    }
  }
}
</script>
<style lang='less' scoped>
  .questionArea {
    width: 100%;
    height: 100%;
    padding-top: 28px;
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
          font-size: 40px; /*px*/
          line-height: 40px; /*px*/
          color: #BCBCBC;
          top: 50%;
          margin-top: -10px;
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
          .msg:last-child {
            padding-bottom: 0;
          }
        }
      }
    }
  }
</style>