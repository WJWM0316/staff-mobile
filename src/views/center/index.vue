<template>
  <div class="center">
    <div class="head">
      <div class="msg">
        <p class="name">{{pageInfo.realname}}</p>
        <p class="desrc">a阿萨德</p>
        <p class="edit" @click.stop="jumpEdit">点击编辑资料</p>
      </div>
      <div class="photo">
        <img :src="pageInfo.avatarInfo.middleUrl" alt="">
      </div>
    </div>
    <div class="main">
      <div class="item">
        <i class="icon1 iconfont icon-mypage_homepage"></i>
        <span class="txt">个人主页</span>
        <i class="icon2 iconfont icon-list_live_icon_more"></i>
      </div>
      <div class="item red">
        <i class="icon1 iconfont icon-btn_comment"></i>
        <span class="txt">我的消息</span>
        <i class="icon2 iconfont icon-list_live_icon_more"></i>
      </div>
      <div class="item">
        <i class="icon1 iconfont icon-icon_list_help"></i>
        <span class="txt">使用帮助</span>
        <i class="icon2 iconfont icon-list_live_icon_more"></i>
      </div>
      <div class="item">
        <i class="icon1 iconfont icon-mypage_homepage"></i>
        <span class="txt">账号管理</span>
        <i class="icon2 iconfont icon-list_live_icon_more"></i>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
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
    jumpEdit () {
      this.$router.push('/center/edit')
    }
  },
  async created () {
    this.pageInfo = this.userInfo
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
        .edit {
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
        margin-bottom: 40px;
        font-size: 0;
        position: relative;
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
          color: #929292;
          margin-right: 12px;
        }
        .icon2 {
          font-size: 30px; /*px*/
          color: #929292;
          float: right;
        }
      }
    }
  }
</style>