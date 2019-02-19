<template>
  <div class="wrap" :style="{'height':  winHeight}">
    <div class="title">
      <img src="https://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/default/loginBg1.png" alt="">
      <span class="msg">你的努力值得被看见</span>
    </div>
    <div class="form">
      <div class="inputBox border-bottom-1px" :class="{'err': accountErr}">
        <input class="account" type="text" v-model="account" placeholder="请输入您的账号">
      </div>
      <div class="inputBox border-bottom-1px" :class="{'err': passwordErr}">
        <input class="password" type="password" v-model="password" placeholder="请输入您的密码">
      </div>
      <div class="inputBox border-bottom-1px" :class="{'err': codeErr}" v-if="verification.img">
        <input class="vcode" type="text" v-model="vcode" placeholder="请输入图片验证码">
        <img class="vcodeImg" :src="verification.img" @click.stop="undataCode">
      </div>
      <xButton class="btn" @click.native="login">登录</xButton>
    </div>
    <div class="btnBox">
      <span @click.stop="toggle(1)" v-if="!isTutor">切换导师版</span>
      <span @click.stop="toggle(2)" v-else>切换成员版</span>
      <span @click.stop="forget">忘记密码</span>
    </div>
  </div>
</template>
<script>
import { userInfoApi } from '@/api/pages/center'
import { loginApi, undataCodeApi } from '@/api/pages/login'
import { wxLogin, login } from '@/api/require'
import localstorage from '@u/localstorage'
import browser from '@u/browser'
import { PHONE, EMAIL } from '@u/regular'
import ws from '@u/websocket'
import settings from '@/config'
export default {
  data () {
    return {
      account: '',
      password: '',
      vcode: '',
      winHeight: 0,
      isTutor: false,
      verification: {
        key: null,
        img: null
      },
      isToggle: false, // 是否切换过，切换了就不记录上一页
      version: 0, // 2 学员版 1 导师版
      accountErr: false, // 账号格式输入错误
      passwordErr: false, // 密码格式输入错误
      codeErr: false // 验证码输入错误
    }
  },
  watch: {
    account (val) {
      val = val.trim()
      if (val !== '' && (!PHONE.test(val) && !EMAIL.test(val))) {
        this.accountErr = true
      } else {
        this.accountErr = false
      }
    },
    password (val) {
      val = val.trim()
      if (val.trim() !== '' && (val.trim().length < 6 || val.trim().length > 20)) {
        this.passwordErr = true
      } else {
        this.passwordErr = false
      }
    },
    vcode (val) {
      val = val.trim()
      if (val !== '' && val.length !== 5) {
        this.codeErr = true
      } else {
        this.codeErr = false
      }
    },
    version () {},
    verification () {}
  },
  computed: {
    isWechat () {
      return browser.isWechat()
    }
  },
  methods: {
    undataCode () {
      undataCodeApi().then(res => {
        this.verification = res.data
      })
    },
    forget () {
      this.$alert({
        title: '忘记密码',
        content: '如果你忘记了你的登录密码，请联系企业管理员进行修改密码'
      })
    },
    login () {
      let data = {
        email: this.account.trim(),
        password: this.password.trim(),
        captchaKey: this.verification.key,
        captchaValue: this.vcode
      }
      let text = ''
      if (data.email === '') {
        text = '请输入您的账号'
      } else if (!PHONE.test(data.email) && !EMAIL.test(data.email)) {
        text = '账号格式错误'
      } else if (data.password === '') {
        text = '请输入您的密码'
      } else if (data.password.length < 6 || data.password.length > 20) {
        text = '密码为6~20个字符'
      } else if (data.captchaValue === '' && this.verification.key) {
        text = '请输入图片验证码'
      }
      if (text !== '') {
        this.$toast({
          text: text,
          width: '9em'
        })
        return false
      }
      login(data, this.isToggle).catch(e => {
        // 错误三次就要输入验证码
        if (e.data.code === 410) {
          this.verification = e.data.data
        }
        // 密码错误
        if (e.data.code === 0) {
          this.passwordErr = true
          this.password = ''
        }
        // 账号错误
        if (e.data.code === 400) {
          this.accountErr = true
          this.account = ''
        }
        // 验证码错误
        if (e.data.code === 411) {
          this.vcode = ''
          this.codeErr = true
        }
      })
    },
    wxlogin () {
      let data = {
        bind_code: localstorage.get('bind_code'),
        is_bind: 1
      }
      wxLogin(data)
    },
    toggle (type) {
      if (type === 1) {
        this.isTutor = true
        localstorage.set('curHome', 'homeTc')
      } else {
        this.isTutor = false
        localstorage.set('curHome', 'home')
      }
      this.isToggle = true
      this.version = type
      this.$toast({
        text: '切换成功',
        type: 'success'
      })
    }
  },
  mounted () {
    let data = localstorage.get('account')
    // 导师端过来的 还是导师登录页
    if (localstorage.get('curHome') === 'homeTc') {
      this.isTutor = true
      this.type = 1
      this.version = 1
    }
    if (data) {
      let {email, password} = data
      this.account = email
      this.password = password
    }
    this.winHeight = window.innerHeight + 'px'
  }
}
</script>
<style lang="less" scoped>
  .wrap {
    box-sizing: border-box;
    padding: 44px 40px;
    background: #000 url('https://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/default/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20181030153705.jpg') no-repeat center center;
    background-size: 100% 100%;
    position: relative;
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
        position: relative;
        &::after {
          background-color: #DCDCDC;
        }
        &.err:after {
          background-color: #D85151;
        }
        .account, .password, .vcode {
          display: block;
          border: none;
          color: #fff;
          font-size: 32px; /*px*/
          font-weight: 300;
          line-height: 20px;
          padding-left: 38px;
          background: url('../../assets/icon/icon_account@3x.png') no-repeat left center;
          background-size: auto 20px;
          width: 100%;
          box-sizing: border-box;
        }
        .password {
          background-image: url('../../assets/icon/icon_password@3x.png');
        }
        .vcode {
          background-image: url('../../assets/icon/icon_authcode@2x.png');
        }
        .vcodeImg {
          height: 30px;
          position: absolute;
          top: 50%;
          margin-top: -24px;
          right: 0;
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
      padding: 0 70px;
      position: absolute;
      bottom: 54px;
      font-weight: 300;
      font-size: 28px; /*px*/
      color: #fff;
      left: 0;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
    }
  }
</style>