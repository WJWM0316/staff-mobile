<template>
  <div class="settings">
    <div class="item" @click.stop="jump('resetPdw')">
      <div>
        <i class="icon1"><img src="@a/icon/icon_phone@3x.png" alt=""></i>
        <span>修改密码</span>
      </div>
      <i class="icon2"><img src="@a/icon/btn_enter@2x.png" alt=""></i>
    </div>
    <div class="item">
      <div @click.stop="jump('tutor')">
        <i class="icon3"><img src="@a/icon/icon_list_change@3x.png" alt=""></i>
        <span>切换身份</span>
      </div>
      <i class="icon2"><img src="@a/icon/btn_enter@2x.png" alt=""></i>
    </div>
    <div class="outLogin">
      <xButton class="btn" @click.native="outLogin">退出登录</xButton>
    </div>
  </div>
</template>
<script>
import localstorage from '@u/localstorage'
import {outLoginApi} from '@/api/pages/login'
export default {
  methods: {
    jump (type) {
      switch (type) {
        case 'resetPdw':
          this.$router.push('/resetPassword')
          break
        case 'tutor':
          this.$router.push('/homeTc')
      }
    },
    outLogin () {
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
  }
}
</script>
<style lang="less" scoped>
.settings {
  padding: 10px 30px 0;
  .item {
    width: 100%;
    padding: 40px 0 0;
    color: #354048;
    font-size: 30px; /*px*/
    font-weight: 300;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icon1, .icon3 {
      width: 20px;
      height: 20px;
      margin-right: 15px;
      vertical-align: middle;
      display: inline-block;
      position: relative;
      img {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
      }
    }
    .icon1 img {
      width: 15px;
      height: 20px;
    }
    .icon3 img {
      width: 20px;
      height: 15px;
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
  .outLogin {
    width: 100%;
    padding: 0 30px;
    position: fixed;
    bottom: 50px;
    left: 0;
    box-sizing: border-box;
    .btn {
      height: 44px;
      overflow: hidden;
      border-radius: 50px;
    }
  }
}
</style>