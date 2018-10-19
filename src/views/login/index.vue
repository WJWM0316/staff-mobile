<template>
  <div class="wrap">
    <div class="title">
      <img src="https://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/default/loginBg1.png" alt="">
      <span class="msg">你的努力值得被看见</span>
    </div>
    <div class="form">
      <div class="inputBox border-bottom-1px" :class="{'err': accountErr}">
        <input class="account" type="text" v-model="account" placeholder="请输入邮箱账号">
      </div>
      <div class="inputBox border-bottom-1px">
        <input class="password" type="password" v-model="password" placeholder="请输入登录密码">
      </div>
      <button class="btn" @click.stop="login">登录</button>
    </div>
    <div class="btnBox">
      <span @click.stop="toggle">切换导师版</span>
      <span @click.stop="forget">忘记密码</span>
    </div>
  </div>
</template>
<script>
import { userInfoApi } from '@/api/pages/center'
import { loginApi } from '@/api/pages/login'
import localstorage from '@u/localstorage'
export default {
  data () {
    return {
      account: '',
      password: '',
      accountErr: false // 邮箱格式输入错误
    }
  },
  methods: {
    forget () {
      this.$alert({
        title: '忘记密码',
        content: '如果你忘记了你的登录密码，请联系企业管理员进行修改密码'
      })
    },
    login () {
      let data = {
        email: this.account,
        password: this.password
      }
      loginApi(data).then(res => {
        localstorage.set('token', res.data.token)
        localstorage.set('account', {account: this.account, password: this.password})
        let company = location.href.split('/')[3] || 'tiger'
        localstorage.set('XPLUSCompany', company)
        userInfoApi().then(res0 => {
          this.$store.dispatch('updata_userInfo', res0.data)
          this.$toast({
            text: '登录成功',
            type: 'success',
            callBack: () => {
              history.back()
            }
          })
        })
      })
    },
    userInfo () {
      return userInfoApi('', false).then(res => {
        return res
      })
    },
    init () {
      return Promise.all([this.userInfo()])
    }
  },
  created () {
    let data = localstorage.get('account')
    this.account = data.account
    this.password = data.password
  }
}
</script>
<style lang="less" scoped>
  .wrap {
    height: 100vh;
    box-sizing: border-box;
    padding: 44px 40px;
    background: url('https://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/default/loginBg2.png') no-repeat center center;
    background-size: 100% 100%;
    background-attachment: fixed;
    .title {
      text-align: center;
      img {
        display: block;
        margin: 0 auto;
        width: 74px;
        display: block;
      }
      .msg {
        display: inline-block;
        font-size: 28px; /*px*/
        line-height: 18px;
        color: #BCBCBC;
        font-weight: 300;
        margin-top: 15px;
        position: relative;
        &::before {
          content: '';
          display: block;
          width: 10px;
          border-top: 1px solid #BCBCBC;
          position: absolute;
          top: 50%;
          margin-top: -0.5px;
          left: -15px;
          transform: scaleY(0.5);
        }
        &::after {
          content: '';
          display: block;
          width: 10px;
          border-top: 1px solid #BCBCBC;
          position: absolute;
          top: 50%;
          margin-top: -0.5px;
          right: -15px;
          transform: scaleY(0.5);
        }
      }
    }
    .form {
      margin-top: 70px;
      .inputBox {
        padding-bottom: 14px;
        margin-bottom: 26px;
        .account, .password {
          display: block;
          border: none;
          color: #fff;
          font-size: 32px; /*px*/
          font-weight: 300;
          line-height: 20px;
          padding-left: 38px;
          background: url('../../assets/icon/icon_account@3x.png') no-repeat left center;
          background-size: auto 20px;
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
      }
    }
    .btnBox {
      width: 100%;
      padding: 0 40px;
      font-weight: 300;
      font-size: 28px; /*px*/
      color: #fff;
      margin-top: 118px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
    }
  }
</style>