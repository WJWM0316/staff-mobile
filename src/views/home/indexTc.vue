<template>
  <div class="indexTc">
    <div class="tab">
      <span :class="{'cur': tabIndex === index, 'red': index === 1}" v-for="(item, index) in tabList" :key="index"  @click.stop="choseTab(index)" >{{item}}</span>
    </div>
    <i class="icon iconfont icon-read_btn_datalog sidebarBtn" @click.stop="showSide = true"></i>
    <Popup v-model="showSide" position="left" class="sidebar">
      <div class="inner"  v-if="userInfo">
        <div class="head">
          <img :src="userInfo.base.avatar.middleUrl" alt="">
        </div>
        <div class="name">{{userInfo.base.realname}}</div>
        <div class="company">{{userInfo.base.realname}}</div>
        <ul class="funtional">
          <li><i class="icon iconfont icon-icon_notice"></i>消息通知</li>
          <li><i class="icon iconfont icon-icon_list_change1"></i>企业切换</li>
          <li><i class="icon iconfont icon-icon_password1"></i>密码修改</li>
          <li><i class="icon iconfont icon-icon_loginout"></i>登出登录</li>
        </ul>
      </div>
    </Popup>
  </div>
</template>
<script>
import { Popup } from 'vux'
import { userInfoApi } from '@/api/pages/center'
import { mapState } from 'vuex'
export default {
  components: {
    Popup
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
      showSide: false
    }
  },
  methods: {
    choseTab (index) {
      this.tabIndex = index
    },
    getUserInfo () {
      if (!this.userInfo) {
        userInfoApi().then(res => {
          console.log(res.data)
          this.$store.dispatch('updata_userInfo', res.data)
        })
      }
    }
  },
  created () {
    this.getUserInfo()
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
      }
    }
  }
</style>