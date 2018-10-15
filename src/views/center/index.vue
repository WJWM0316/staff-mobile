<template>
  <div class="center" v-if="pageInfo">
    <div class="head">
      <div class="msg">
        <p class="name">{{pageInfo.realname}}</p>
        <p class="desrc" v-if="pageInfo.flag">{{pageInfo.flag}}</p>
        <p class="desrc"><span v-if="pageInfo.groupName">{{pageInfo.groupName}} | </span>{{pageInfo.occupation}}</p>
        <p class="editBtn" @click.stop="jump('edit')">点击编辑资料</p>
      </div>
      <div class="photo defaultImg">
        <img :src="pageInfo.avatar.middleUrl" alt="" v-preview  v-if="pageInfo.avatar">
      </div>
    </div>
    <div class="main">
      <div class="item" @click.stop="jump('main')">
        <div>
          <i class="icon1 iconfont icon-mypage_homepage"></i>
          <span class="txt">个人主页</span>
        </div>
        <i class="icon2">
          <img src="@a/icon/btn_enter@2x.png" alt="">
        </i>
      </div>
      <div class="item"  @click.stop="jump('message')" :class="{'red' : pageInfo.noteCount > 0}">
        <div>
          <i class="icon1 iconfont icon-btn_comment"></i>
          <span class="txt">我的消息</span>
        </div>
        <i class="icon2">
          <img src="@a/icon/btn_enter@2x.png" alt="">
        </i>
      </div>
      <div class="item"  @click.stop="jump('help')">
        <div>
          <i class="icon1 iconfont icon-icon_list_help"></i>
          <span class="txt">使用帮助</span>
        </div>
        <i class="icon2">
          <img src="@a/icon/btn_enter@2x.png" alt="">
        </i>
      </div>
      <div class="item"  @click.stop="jump('settings')">
        <div>
          <i class="icon">
            <img src="@a/icon/112430611557630831.png" alt="">
          </i>
          <span class="txt">账号管理</span>
        </div>
        <i class="icon2">
          <img src="@a/icon/btn_enter@2x.png" alt="">
        </i>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { userInfoApi } from '@/api/pages/center'
export default {
  data () {
    return {
      pageInfo: null
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.global.userInfo
    })
  },
  methods: {
    jump (type) {
      switch (type) {
        case 'edit':
          this.$router.push('/infoEdit')
          break
        case 'main':
          this.$router.push('/personalPage')
          break
        case 'message':
          this.$router.push('/message')
          break
        case 'help':
          this.$router.push('/help')
          break
        case 'settings':
          this.$router.push('/settings')
          break
      }
    },
    async getUserInfo () {
      if (!this.userInfo) {
        let res = await userInfoApi()
        this.pageInfo = res.data.base
        this.$store.dispatch('updata_userInfo', res.data)
      } else {
        this.pageInfo = this.userInfo.base
      }
    }
  },
  created () {
    this.getUserInfo()
  }
}
</script>
<style lang="less" scoped>
  @import url("../../styles/mixins.less");
  .center {
    padding: 40px 30px;
    box-sizing: border-box;
    .head {
      overflow: hidden;
      position: relative;
      padding-right: 100px;
      .msg {
        width: 100%;
        .name {
          font-size: 40px; /*px*/
          font-weight: 500;
          line-height: 24px;
          color: #354048;
        }
        .desrc {
          font-size: 28px; /*px*/
          font-weight: 300;
          line-height: 18px;
          color: #929292;
          margin-top: 5px;
        }
        .editBtn {
          font-size: 24px; /*px*/
          font-weight: 400;
          line-height: 16px;
          color: #D7AB70;
          margin-top: 17px;
        }

      }
      .photo {
        width: 80px;
        height: 80px;
        position: absolute;
        border-radius: 50%;
        top: 0;
        right: 0;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
    }
    .main {
      margin-top: 60px;
      .item {
        &>div {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        margin-bottom: 40px;
        font-size: 0;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &.red::after {
          content: '';
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #FF3434;
          position: absolute;
          top: 50%;
          margin-top: -3.5px;
          right: 20px;
        }
        .txt {
          font-size: 30px; /*px*/
          color: #354048;
        }
        .icon1 {
          font-size: 34px; /*px*/
          color: rgb(188, 188, 188);
          margin-right: 12px;
        }
        .icon {
          width: 17px;
          height: 17px;
          margin-right: 0.32rem;
          display: inline-block;
          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }
        .icon2 {
          width: 20px;
          height: 20px;
          display: inline-block;
          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }
      }
    }
  }
</style>