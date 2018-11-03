<template>
  <div class="personalPage" ref="personalPage"  v-if="userInfo">
    <div class="head">
      <div class="information"
        v-if="!userInfo.base.mobile || !userInfo.base.wechat || !userInfo.base.email"
        @click.stop="contactInformation.showSheet = true">联系方式<img class="icon" src="@a/icon/bnt_more_contact@3x.png">
      </div>
      <div class="msg">
        <div class="photo">
          <img v-if="userInfo.base" :src="userInfo.base.avatar.middleUrl">
        </div>
        <p class="name">{{userInfo.base.realname}}</p>
        <p class="position" v-if="!userInfo.base.isExternalTutor && (userInfo.base.groupName || userInfo.base.occupation)"><span v-if="userInfo.base.groupName">{{userInfo.base.groupName}} |</span> {{userInfo.base.occupation}}</p>
        <p class="position" v-if="userInfo.base.isExternalTutor && userInfo.base.title">{{userInfo.base.title}}</p>
        <backHome class="backHome1"></backHome>
      </div>
      <div class="studyMsg">
        <div class="item">
          <p class="result">{{userInfo.study.studyTimeCount}}</p>
          <p class="txt">学习时长/小时</p>
        </div>
        <div class="item">
          <p class="result">{{userInfo.study.lessonCount}}</p>
          <p class="txt">在学课程数/个</p>
        </div>
        <div class="item">
          <p class="result">{{userInfo.study.sessionCardCount}}</p>
          <p class="txt">打卡数/节</p>
        </div>
      </div>
    </div>
    <!-- 企业个人 -->
    <template v-if="!userInfo.base.isExternalTutor">
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
              v-if="index < 5"
            ></infoCard>
          </div>
          <div class="btn" v-if="joinList.lessons.length > 5">
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
              v-if="index < 5"
            ></infoCard>
          </div>
          <div class="btn" v-if="joinList.lives.length > 5">
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
              type="2"
              v-if="index < 5"
            ></infoCard>
          </div>
          <div class="btn" v-if="joinList.jobcircles.length > 5">
            <button class="jump" @click.stop="jumpList('jobcircles')">查看Ta加入的所有工作圈</button>
          </div>
        </div>
        <noDataShow v-if="joinList.lessons.length === 0 && joinList.lives.length === 0 && joinList.jobcircles.length === 0"></noDataShow>
      </div>
      <div class="poster" v-show="tabIndex === 1">
        <dynamicItem
          v-for="(item, index) in postData.list"
          :key="index"
          :item="item"
          :showCommunicate="false"
          :personal="true"
        ></dynamicItem>
        <pullUpUi :noData="postData.noData" :pullUpStatus="postData.pullUpStatus" @pullUp="pullUp"></pullUpUi>
        <noDataShow v-if="postData.list.length === 0"></noDataShow>
      </div>
    </template>

    <!-- 外部导师 -->
    <template v-else>
      <div class="tab" :class="{'floor': needFloor}">
        <span class="tabItem"
          v-for="(item, index) in extTabList"
          :key="index"
          :class="{'selected': tabExtIndex === index}"
          @click.stop="choseTab(index)"
        >{{item}}</span>
      </div>
      <div class="content">
        <div v-if="tabExtIndex === 0">
          <infoCard
            v-for="item in courseData.list"
            :item="item"
            :key="item.id"
            type="1"
          ></infoCard>
          <pullUpUi :noData="courseData.noData" :pullUpStatus="courseData.pullUpStatus" @pullUp="pullUp"></pullUpUi>
          <noDataShow v-if="courseData.list.length === 0"></noDataShow>
        </div>
        <div v-if="tabExtIndex === 1">
          <infoCard
            v-for="item in liveData.list"
            :item="item"
            :key="item.liveId"
            type="3"
          ></infoCard>
          <pullUpUi :noData="liveData.noData" :pullUpStatus="liveData.pullUpStatus" @pullUp="pullUp"></pullUpUi>
          <noDataShow v-if="liveData.list.length === 0"></noDataShow>
        </div>
      </div>
    </template>

    <!-- 复制功能模块 -->
    <template>
      <actionSheet
        :showSheet="contactInformation.showSheet"
        :menus="contactInformation.menus"
        @choseResult="choseResult"
        @clickMask="clickMask"
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
    </template>
  </div>
</template>
<script>
import { userInfoApi, getUserInfoApi, getUserJoinedListApi, getMyJoinedListApi, getMyPostListApi, getUserPostListApi, getTaCourseApi, getTaLiveApi } from '@/api/pages/center'
import infoCard from '@c/business/infoCard.vue'
import dynamicItem from '@c/business/dynamicItem'
import noDataShow from '@c/layout/noDataShow'
import backHome from '@c/layout/backHome'
export default {
  components: {
    infoCard,
    noDataShow,
    dynamicItem,
    backHome
  },
  data () {
    return {
      userInfo: null,
      tabIndex: 0,
      tabExtIndex: 0,
      joinList: null, // Ta加入的列表
      postData: { // Ta参与的帖子
        list: [],
        noData: false,
        page: 0,
        pullUpStatus: false
      },
      courseData: { // 外部导师的课程列表
        list: [],
        noData: false,
        page: 0,
        pullUpStatus: false
      },
      liveData: { // 外部导师的直播列表
        list: [],
        noData: false,
        page: 0,
        pullUpStatus: false
      },
      needFloor: false, // tab栏悬浮
      contactInformation: { // 复制对象
        showSheet: false,
        copyMessage: '',
        menus: {}
      }
    }
  },
  computed: {
    tabList () {
      if (this.$route.query.uid) {
        return ['Ta加入的', 'Ta的帖子']
      } else {
        return ['我加入的', '我的帖子']
      }
    },
    extTabList () {
      if (this.$route.query.uid) {
        return ['Ta的课程', 'Ta的课程']
      } else {
        return ['我的课程', '我的直播']
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
    clickMask () {
      this.contactInformation.showSheet = false
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
      if (!this.userInfo.base.isExternalTutor) {
        this.tabIndex = index
        if (index === 1 && this.postData.list.length === 0) {
          this.getPostList({page: 1})
        }
      } else {
        this.tabExtIndex = index
        if (index === 1 && this.liveData.list.length === 0) {
          this.getTaLive({page: 1})
        }
      }
    },
    jumpList (type) {
      switch (type) {
        case 'course':
          this.$router.push('/myCourse')
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
      return new Promise((resolve, reject) => {
        let conType = () => {
          if (this.userInfo.base.mobile) this.contactInformation.menus.mobile = `手机号：${this.userInfo.base.mobile}`
          if (this.userInfo.base.wechat) this.contactInformation.menus.wechat = `微信号：${this.userInfo.base.wechat}`
          if (this.userInfo.base.email) this.contactInformation.menus.email = `邮箱：${this.userInfo.base.email}`
        }
        if (!this.$route.query.uid) {
          this.userInfo = this.$store.getters.userInfo
          if (!this.userInfo) {
            userInfoApi().then(res => {
              this.userInfo = res.data
              resolve(res.data)
              conType()
            })
          } else {
            resolve(this.userInfo)
          }
        } else {
          let data = {
            uid: this.$route.query.uid
          }
          getUserInfoApi(data).then(res => {
            this.userInfo = res.data
            conType()
            resolve(res.data)
          }).catch(res => {
            this.$router.go(-1)
          })
        }
      })
    },
    getPostList (needLoading) {
      return new Promise((resolve, reject) => {
        this.postData.page++
        if (!this.$route.query.uid) {
          let data = {
            uid: this.$route.query.uid,
            page: this.postData.page
          }
          getMyPostListApi(data, needLoading).then(res => {
            this.postData.list = this.postData.list.concat(res.data)
            if (res.meta && res.meta.currentPage === res.meta.lastPage) {
              this.postData.noData = true
            }
            resolve(this.postList)
          })
        } else {
          let data = {
            uid: this.$route.query.uid,
            page: this.postData.page
          }
          getUserPostListApi(data, needLoading).then(res => {
            this.postData.list = this.postData.list.concat(res.data)
            if (res.meta && res.meta.currentPage === res.meta.lastPage) {
              this.postData.noData = true
            }
            resolve(this.postList)
          })
        }
      })
    },
    getJoinList () {
      if (!this.$route.query.uid) {
        getMyJoinedListApi({count: 6}).then(res => {
          this.joinList = res.data
        })
      } else {
        getUserJoinedListApi({uid: this.$route.query.uid, count: 6}).then(res => {
          this.joinList = res.data
        })
      }
    },
    getTaCourse (needLoading) {
      return new Promise((resolve, reject) => {
        this.courseData.page++
        let data = {
          uid: this.$route.query.uid,
          page: this.courseData.page
        }
        getTaCourseApi(data, needLoading).then(res => {
          this.courseData.list = this.courseData.list.concat(res.data)
          if (res.meta && res.meta.currentPage === res.meta.lastPage) {
            this.courseData.noData = true
          }
          resolve(res)
        })
      })
    },
    getTaLive (needLoading) {
      return new Promise((resolve, reject) => {
        this.liveData.page++
        let data = {
          uid: this.$route.query.uid,
          page: this.liveData.page
        }
        getTaLiveApi(data, needLoading).then(res => {
          this.liveData.list = this.liveData.list.concat(res.data)
          if (res.meta && res.meta.currentPage === res.meta.lastPage) {
            this.liveData.noData = true
          }
          resolve(res)
        })
      })
    },
    pullUp () {
      if (!this.userInfo.base.isExternalTutor) {
        this.postData.pullUpStatus = true
        this.getPostList(false).then(res => {
          this.postData.pullUpStatus = false
        })
      } else {
        if (this.tabExtIndex === 0) {
          this.courseData.pullUpStatus = true
          this.getTaCourse(false).then(res => {
            this.courseData.pullUpStatus = false
          })
        } else {
          this.liveData.pullUpStatus = true
          this.getTaLive(false).then(res => {
            this.liveData.pullUpStatus = false
          })
        }
      }
    },
    init () {
      this.getUserInfo().then(res => {
        if (!res.base.isExternalTutor) {
          this.getJoinList()
        } else {
          this.getTaCourse()
        }
      })
    }
  },
  created () {
    this.init()
  },
  mounted () {
    let offsetTop = 268 * window.dpr
    window.onscroll = (e) => {
      if (window.scrollY > offsetTop) {
        if (!this.needFloor) this.needFloor = true
      } else {
        if (this.needFloor) this.needFloor = false
      }
    }
  }
}
</script>
<style lang="less">
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
        width: 70%;
        margin: 0 auto;
        font-size: 36px; /*px*/
        color: #354048;
        line-height: 22px;
        font-weight: 700;
        margin-top: 10px;
        .setEllipsis();
      }
      .position {
        width: 70%;
        margin: 0 auto;
        font-size: 28px; /*px*/
        color: #666666;
        line-height: 18px;
        font-weight: 300;
        margin-top: 7px;
        .setEllipsis();
      }
      .backHome1 {
        .home {
          top: 50px;
        }
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
          font-family: 'MyNewFont'
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
        font-weight: 700;
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
      margin-bottom: 64px;
      .title {
        padding: 0 0 10px 15px;
        color: #929292;
        font-size: 36px; /*px*/
        font-weight: 700;
        line-height: 22px;
      }
      .content {
      }
      .btn {
        padding: 15px 20px 0;
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