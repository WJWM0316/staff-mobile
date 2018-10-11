<template>
  <div class="resetPassword">
    <div class="title">修改密码</div>
    <div class="item border-bottom-1px">
      <span class="txt">旧密码</span>
      <input type="password" v-model="oldPassword" placeholder="请输入您的旧密码">
    </div>
    <div class="item border-bottom-1px">
      <span class="txt">新密码</span>
      <input type="password" v-model="newPassword" placeholder="请输入新密码">
    </div>
    <div class="item border-bottom-1px">
      <span class="txt">确认密码</span>
      <input type="password" v-model="confirmPassword" placeholder="请再次输入新密码">
    </div>
    <xButton class="btn" @click.native="reset" :disabled="disabled">确定修改密码</xButton>
  </div>
</template>
<script>
import {resetPwdApi} from '@/api/pages/login'
export default {
  data () {
    return {
      oldPassword: null,
      newPassword: null,
      confirmPassword: null
    }
  },
  computed: {
    disabled () {
      if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    reset () {
      if (this.newPassword !== this.confirmPassword) {
        this.$toast({
          text: `两次密码输入不同`,
          position: 'bottom',
          width: '10em'
        })
        return
      }
      let data = {
        originalPwd: this.oldPassword,
        newPwd: this.newPassword
      }
      resetPwdApi(data).then(res => {
        this.$toast({
          text: '修改成功',
          type: 'success',
          callBack: () => {
            history.back()
          }
        })
      })
    }
  },
  created () {
  }
}
</script>
<style lang="less">
  .resetPassword {
    padding: 50px 30px 0;
    .title {
      font-size: 48px; /*px*/
      font-weight: 400;
      color: #354048;
      line-height: 28px;
    }
    .item {
      padding: 25px 0 15px;
      .txt {
        width: 60px;
        display: inline-block;
        font-size: 30px; /*px*/
        font-weight: 300;
        color: #354048;
        margin-right: 13px;
      }
      input {
        border: none;
        font-size: 30px; /*px*/
        font-weight: 300;
        color: #354048;
      }
    }
    .btn {
      width: 100%;
      height: 44px;
      border-radius: 50px;
      margin-top: 40px;
    }
  }
</style>