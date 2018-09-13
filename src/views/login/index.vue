<template>
  <div class="wrap">
    <p class="title">欢迎登录小灯塔Plus</p>
    <div class="inputBox border-bottom-1px">
      <input class="account" type="text" v-model="account" placeholder="请输入邮箱账号" @input="changeTxt()">
    </div>
    <div class="inputBox border-bottom-1px">
      <input class="password" type="text" v-model="password" placeholder="请输入登录密码" @input="changeTxt()">
    </div>
    <button class="btn" :class="{'can' : this.account !== '' && this.password !== ''}" @click.stop="login">登录</button>
  </div>
</template>
<script>
import { loginApi } from '@/api/pages/login'
export default {
  data () {
    return {
      account: '',
      password: ''
    }
  },
  methods: {
    changeTxt () {
    },
    login () {
      let data = {
        email: this.account,
        password: this.password
      }
      loginApi(data).then(res => {
        this.$showToast('登录成功', () => {
          this.$router.go(-1)
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .wrap {
    padding: 0 30px;
    .title {
      font-size: 52px; /*px*/
      line-height: 34px;
      font-weight: 300;
      margin: 45px 0 55px;
      text-align: center;
    }
    .inputBox {
      padding-bottom: 14px;
      margin-bottom: 26px;
      .account, .password {
        display: block;
        border: none;
        color: #354048;
        font-size: 32px; /*px*/
        font-weight: 400;
        line-height: 20px;
        padding-left: 38px;
        background: url('../../assets/icon/icon_account@3x.png') no-repeat left center;
        background-size: 20px 20px;
      }
      .password {
        background-image: url('../../assets/icon/icon_password@3x.png');
      }
    }
    .btn {
      margin-top: 14px;
      width: 100%;
      height: 44px;
      color: #354048;
      background: #FFE266;
      font-size: 30px; /*px*/
      line-height: 44px;
      text-align: center;
      border: none;
      border-radius: 22px;
      opacity: 0.5;
      &.can {
        opacity: 1;
      }
    }
  }
</style>