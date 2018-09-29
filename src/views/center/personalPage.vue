<template>
  <div class="personalPage" ref="personalPage">
    <div class="head" v-if="userInfo">
      <div class="information" @click.stop="contactInformation.showSheet = true">联系方式<img class="icon" src="@a/icon/bnt_more_contact@3x.png"></div>
      <div class="msg">
        <div class="photo">
          <img v-if="userInfo.base" :src="userInfo.base.avatar.middleUrl">
        </div>
        <p class="name">{{userInfo.base.realname}}</p>
        <p class="position">{{userInfo.base.groupName}} | {{userInfo.base.occupation}}</p>
      </div>
      <div class="studyMsg">
        <div class="item">
          <p class="result">{{userInfo.study.studyTimeCount}}</p>
          <p class="txt">学习时长/小时</p>
        </div>
        <div class="item">
          <p class="result">{{userInfo.study.lessonCount}}</p>
          <p class="txt">正在学习课程/个</p>
        </div>
        <div class="item">
          <p class="result">{{userInfo.study.sessionCardCount}}</p>
          <p class="txt">打卡数/节</p>
        </div>
      </div>
    </div>
    <div class="tab" :class="{'floor': needFloor}">
      <span class="tabItem"
        v-for="(item, index) in tabList"
        :key="index"
        :class="{'selected': tabIndex === index}"
        @click.stop="choseTab(index)"
      >{{item}}</span>
    </div>
    <div class="joined"  ref="joined" v-show="tabIndex === 0" v-if="joinList">
      <div class="course" v-if="joinList.lessons.length > 0">
        <p class="title border-bottom-1px">课程</p>
        <div class="content">
          <infoCard
            v-for="(item, index) in joinList.lessons"
            :item="item"
            :key="index"
            type="1"
          ></infoCard>
        </div>
        <div class="btn">
          <button class="jump" @click.stop="jumpList('course')">查看Ta加入的所有课程</button>
        </div>
      </div>
      <div class="live" v-if="joinList.lives.length > 0">
        <p class="title border-bottom-1px">直播</p>
        <div class="content">
          <infoCard
            v-for="(item, index) in joinList.lives"
            :item="item"
            :key="index"
            type="3"
          ></infoCard>
        </div>
        <div class="btn">
          <button class="jump" @click.stop="jumpList('live')">查看Ta加入的所有直播</button>
        </div>
      </div>
      <div class="circles" v-if="joinList.jobcircles.length > 0">
        <p class="title border-bottom-1px">工作圈</p>
        <div class="content">
          <infoCard
            v-for="(item, index) in joinList.jobcircles"
            :item="item"
            :key="index"
            type="1"
          ></infoCard>
        </div>
        <div class="btn">
          <button class="jump" @click.stop="jumpList('jobcircles')">查看Ta加入的所有工作圈</button>
        </div>
      </div>
      <noDataShow v-if="joinList.lessons.length === 0 && joinList.lives.length === 0 && joinList.jobcircles.length === 0"></noDataShow>
    </div>
    <div class="poster" v-show="tabIndex === 1" v-if="postList">
      <noDataShow v-if="postList.length === 0"></noDataShow>
    </div>
    <actionSheet
      :showSheet="contactInformation.showSheet"
      :menus="contactInformation.menus"
      @choseResult="choseResult"
      >
    </actionSheet>
    <button
      type="button"
      ref="copyBtn"
      v-show=false
      v-clipboard:copy="contactInformation.copyMessage"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError">clipboard复制按钮
    </button>
  </div>
</template>
<script>
import { getUserInfoApi, getUserJoinedListApi, getMyJoinedListApi, getMyPostListApi, getUserPostListApi } from '@/api/pages/center'
import infoCard from '@c/business/infoCard.vue'
import noDataShow from '@c/layout/noDataShow'
export default {
  components: {
    infoCard,
    noDataShow
  },
  data () {
    return {
      userInfo: null,
      tabIndex: 0,
      tabList: ['Ta加入的', 'Ta的帖子'],
      joinList: null,
      postList: null,
      needFloor: false,
      contactInformation: {
        showSheet: false,
        copyMessage: '',
        menus: {}
      }
    }
  },
  methods: {
    choseResult (val) {
      this.contactInformation.showSheet = false
      if (val !== 'cancel') {
        switch (val) {
          case 'mobile':
            this.contactInformation.copyMessage = this.userInfo.base.mobile
            break
          case 'wechat':
            this.contactInformation.copyMessage = this.userInfo.base.wechat
            break
          case 'email':
            this.contactInformation.copyMessage = this.userInfo.base.email
            break
        }
        setTimeout(() => {
          this.$refs.copyBtn.click()
        }, 100)
      }
    },
    onCopy () {
      this.$toast({
        text: '复制成功',
        type: 'success'
      })
    },
    onError () {
      this.$toast({
        text: '复制失败',
        type: 'warn'
      })
    },
    choseTab (index) {
      this.tabIndex = index
      if (index === 1 && !this.postList) {
        this.getPostList({page: 1})
      }
    },
    jumpList (type) {
      switch (type) {
        case 'course':
          this.$router.push('/course')
          break
        case 'live':
          this.$router.push('/live')
          break
        case 'jobcircles':
          this.$router.push('/workCircle')
          break
      }
    },
    getUserInfo () {
      if (!this.$route.query.uid) {
        this.userInfo = this.$store.getters.userInfo
        if (this.userInfo.base.mobile) this.contactInformation.menus.mobile = `手机号：${this.userInfo.base.mobile}`
        if (this.userInfo.base.wechat) this.contactInformation.menus.wechat = `微信号：${this.userInfo.base.wechat}`
        if (this.userInfo.base.email) this.contactInformation.menus.email = `邮箱：${this.userInfo.base.email}`
      } else {
        let data = {
          uid: this.$route.query.uid
        }
        getUserInfoApi(data).then(res => {
          this.userInfo = res.data
          if (this.userInfo.base.mobile) this.contactInformation.menus.mobile = `手机号：${this.userInfo.base.mobile}`
          if (this.userInfo.base.wechat) this.contactInformation.menus.wechat = `微信号：${this.userInfo.base.wechat}`
          if (this.userInfo.base.email) this.contactInformation.menus.email = `邮箱：${this.userInfo.base.email}`
        })
      }
    },
    getPostList ({page, count}, needLoading) {
      if (!this.$route.query.uid) {
        let data = {
          page: page || 1,
          count: count || 20
        }
        getMyPostListApi(data, needLoading).then(res => {
          this.postList = res.data
        })
      } else {
        let data = {
          uid: this.$route.query.uid,
          page: page || 1,
          count: count || 20
        }
        getUserPostListApi(data, needLoading).then(res => {
          this.postList = res.data
        })
      }
    },
    getJoinList () {
      if (!this.$route.query.uid) {
        getMyJoinedListApi().then(res => {
          this.joinList = res.data
        })
      } else {
        getUserJoinedListApi({uid: this.$route.query.uid}).then(res => {
          this.joinList = res.data
        })
      }
    },
    init () {
      this.getUserInfo()
      this.getJoinList()
    }
  },
  created () {
    this.init()
  },
  mounted () {
    let offsetTop = 268 * window.dpr
    window.onscroll = (e) => {
      console.log(window.scrollY, offsetTop)
      if (window.scrollY > offsetTop) {
        this.needFloor = true
      } else {
        this.needFloor = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
.personalPage {
  .head {
    width: 100%;
    padding: 25px 0 40px;
    text-align: center;
    position: relative;
    .information {
      font-size: 24px; /*px*/
      color: #929292;
      font-weight: 300;
      line-height: 16px;
      position: absolute;
      top: 20px;
      right: 10px;
      .icon {
        width: 22px;
        height: 22px;
        display: inline-block;
        margin-left: 3px;
      }
    }
    .msg {
      .photo {
        width: 75px;
        height: 75px;
        border-radius: 50%;
        overflow: hidden;
        margin: 0 auto;
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
      .name {
        font-size: 36px; /*px*/
        color: #354048;
        line-height: 22px;
        font-weight: 500;
        margin-top: 10px;
      }
      .position {
        font-size: 28px; /*px*/
        color: #666666;
        line-height: 18px;
        font-weight: 300;
        margin-top: 7px;
      }
    }
    .studyMsg {
      margin-top: 30px;
      display: flex;
      .item {
        flex: 1;
        .result {
          font-size: 58px; /*px*/
          color: #D7AB70;
          line-height: 29px;
          font-weight: 500;
        }
        .txt {
          font-size: 24px; /*px*/
          color: #929292;
          line-height: 12px;
          font-weight: 300;
          margin-top: 8px;
        }
      }
    }
  }
  .tab {
    width: 100%;
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 8%;
    box-sizing: border-box;
    background: #F8F8F8;
    &.floor {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1;
    }
    .tabItem {
      flex: 1;
      text-align: center;
      font-size: 32px; /*px*/
      font-weight: 300;
      &.selected {
        color: #354048;
        font-weight: 500;
        position: relative;
        height: 100%;
        line-height: 44px;
        &::after {
          content: '';
          width: 64px;
          height: 3px;
          background: #FFE266;
          position: absolute;
          bottom: 0;
          left: 50%;
          margin-left: -32px;
        }
      }
    }
  }
  .joined {
    padding: 30px 0 0;
    .course, .live, .circles {
      .title {
        padding: 0 0 10px 15px;
        color: #929292;
        font-size: 36px; /*px*/
        font-weight: 500;
        line-height: 22px;
      }
      .content {
      }
      .btn {
        padding: 15px 20px 64px;
        .jump {
          width: 100%;
          height: 40px;
          line-height: 40px;
          border-radius: 20px;
          text-align: center;
          color: #666;
          font-weight: 300;
          box-sizing: border-box;
          border: none;
          background: #F8F8F8;
        }
      }
    }
  }
}
</style>