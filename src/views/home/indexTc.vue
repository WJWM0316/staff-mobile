<template>
  <div class="indexTc">
    <div class="tab">
      <span :class="{'cur': tabIndex === index, 'red': index === 1}" v-for="(item, index) in tabList" :key="index"  @click.stop="choseTab(index)" >{{item}}</span>
    </div>
    <i class="icon iconfont icon-read_btn_datalog sidebarBtn" @click.stop="showSide = true"></i>
    <div class="courseList" v-show="tabIndex === 0">
      <infoCard v-for="item in courseList.list" :key="item.id" :item="item" type='1' :ellipsis2='true'></infoCard>
      <pullUpUi v-if="tabIndex === 0" :noData="courseList.noData" :pullUpStatus="courseList.pullUpStatus" @pullUp="pullUp"></pullUpUi>
      <noDataShow v-if="courseList.list.length === 0"></noDataShow>
    </div>
    <div class="liveList" v-show="tabIndex === 1">
      <infoCard v-for="item in liveList.list" :key="item.id" :item="item" type='3'></infoCard>
      <pullUpUi v-if="tabIndex === 1" :noData="liveList.noData" :pullUpStatus="liveList.pullUpStatus" @pullUp="pullUp"></pullUpUi>
      <noDataShow v-if="liveList.list.length === 0"></noDataShow>
    </div>
    <!-- 侧边栏 -->
    <Popup v-model="showSide" position="left" class="sidebar">
      <div class="inner"  v-if="userInfo">
        <div class="head">
          <img :src="userInfo.base.avatar.middleUrl" alt="">
        </div>
        <div class="name">{{userInfo.base.realname}}</div>
        <div class="company">{{userInfo.base.realname}}</div>
        <ul class="funtional">
          <li @click.stop="jump('message')"><i class="icon iconfont icon-icon_notice"></i>消息通知</li>
          <li @click.stop="jump('enterprise')"><i class="icon iconfont icon-icon_list_change1"></i>企业切换</li>
          <li @click.stop="jump('change')"><i class="icon iconfont icon-icon_password1"></i>密码修改</li>
          <li @click.stop="jump('outLogin')"><i class="icon iconfont icon-icon_loginout"></i>退出登录</li>
        </ul>
        <div class="logo"><img src="@a/icon/toturBg.png" alt=""></div>
      </div>
    </Popup>
  </div>
</template>
<script>
import { Popup } from 'vux'
import { getTutorInfoApi } from '@/api/pages/center'
import { getCourseTcApi } from '@/api/pages/course'
import { getTutorLiveApi } from '@/api/pages/live'
import { outLoginApi } from '@/api/pages/login'
import infoCard from '@c/business/infoCard'
import localstorage from '@u/localstorage'
import { mapState } from 'vuex'
export default {
  components: {
    Popup,
    infoCard
  },
  computed: {
    ...mapState({
      userInfo: state => state.global.userInfo
    })
  },
  data () {
    return {
      tabIndex: 0,
      tabList: ['课程', '直播'],
      showSide: false,
      courseList: {
        list: [],
        noData: false,
        page: 0,
        pullUpStatus: false
      },
      liveList: {
        list: [],
        noData: false,
        page: 0,
        pullUpStatus: false
      }
    }
  },
  methods: {
    jump (type) {
      switch (type) {
        case 'message':
          this.$router.push('/message')
          break
        case 'enterprise':
          this.$router.push('/message')
          break
        case 'change':
          this.$router.push('/resetPassword')
          break
        case 'outLogin':
          this.$confirm({
            content: '确定退出账号？',
            confirmBack: () => {
              outLoginApi().then(res => {
                localstorage.remove('XPLUSCompany')
                this.$toast({
                  text: '退出成功',
                  type: 'success',
                  callBack: () => {
                    this.$router.replace('/login')
                  }
                })
              })
            }
          })
      }
    },
    choseTab (index) {
      this.tabIndex = index
      if (index === 1) {
        this.$router.push('/homeTc?live=true')
      } else {
        this.$router.push('/homeTc')
      }
      this.init()
    },
    getUserInfo () {
      if (!this.userInfo) {
        getTutorInfoApi().then(res => {
          this.$store.dispatch('updata_userInfo', res.data)
        })
      }
    },
    getCourse () {
      return new Promise((resolve, reject) => {
        this.courseList.page++
        getCourseTcApi({page: this.courseList.page}).then(res => {
          this.courseList.list = this.courseList.list.concat(res.data)
          if (res.meta.currentPage === res.meta.lastPage) {
            this.courseList.noData = true
          }
        })
      })
    },
    getLive () {
      return new Promise((resolve, reject) => {
        this.liveList.page++
        getTutorLiveApi({page: this.liveList.page}).then(res => {
          this.liveList.list = this.liveList.list.concat(res.data)
          if (res.meta.currentPage === res.meta.lastPage) {
            this.liveList.noData = true
          }
        })
      })
    },
    async pullUp () {
      if (this.tabIndex === 0) {
        this.courseList.pullUpStatus = true
        await this.getCourse()
        this.courseList.pullUpStatus = false
      } else {
        this.liveList.pullUpStatus = true
        await this.getLive()
        this.liveList.pullUpStatus = false
      }
    },
    init () {
      if (!this.$route.query.live) {
        this.tabIndex = 0
        if (this.courseList.list.length === 0) {
          this.getCourse()
        }
      } else {
        this.tabIndex = 1
        if (this.liveList.list.length === 0) {
          this.getLive()
        }
      }
    }
  },
  created () {
    this.getUserInfo()
    this.init()
  }
}
</script>
<style lang="less" scoped>
  .indexTc {
    position: relative;
    .tab {
      padding: 0 110px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 49px;
      color: #BCBCBC;
      font-weight: 300;
      box-shadow: 0px 3px 5px 0px rgba(248,248,248,1);
      > span {
        line-height: 49px;
        position: relative;
        &.cur {
          color: #354048;
          font-weight: 700;
          position: relative;
          &::after {
            content: '';
            width: 25px;
            height: 3px;
            background: #FFE266;
            border-radius: 10px;
            position: absolute;
            left: 50%;
            margin-left: -12.5px;
            bottom: 0;
          }
        }
        &.red::before {
          content: '';
          width: 7px;
          height: 7px;
          border-radius: 50%;
          position: absolute;
          top: 10px;
          right: -10px;
          background: #FF3434;
        }
      }
    }
    .sidebarBtn {
      position: absolute;
      top: 15px;
      left: 15px;
      font-size: 30px; /*px*/
      color: #BCBCBC;
    }
    .sidebar {
      width: 260px !important;
      padding: 30px 15px 20px;
      background: #fff;
      .head {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        margin: 0 auto;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
      .name {
        font-size: 40px; /*px*/
        font-weight: 700;
        color: #354048;
        line-height: 24px;
        text-align: center;
        margin-top: 10px;
      }
      .company {
        color: #666666;
        font-weight: 300;
        font-size: 26px; /*px*/
        text-align: center;
        line-height: 18px;
        margin-top: 2px;
      }
      .funtional {
        padding: 0 30px;
        margin-top: 50px;
        color: #354048;
        font-weight: 700;
        font-size: 30px; /*px*/
        > li {
          margin-bottom: 30px;
          line-height: 20px;
          vertical-align: middle;
          .icon {
            font-size: 40px; /*px*/
            margin-right: 19px;
            color: rgb(188, 188, 188);
          }
        }
      }
      .logo {
        width: 130px;
        position: absolute;
        left: 50%;
        margin-left: -65px;
        bottom: 70px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>