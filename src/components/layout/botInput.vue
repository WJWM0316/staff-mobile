<template>
  <div class="botInput">
    <div class="inputBox">
      <input type="text" v-focus v-model="tutorTxt" placeholder="请输入内容" ref="input">
    </div>
    <span class="btn" @click.stop="sendMsg">发送</span>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tutorTxt: null
    }
  },
  methods: {
    sendMsg () {
      this.$emit('sendMsg', this.tutorTxt)
      this.tutorTxt = null
    },
    _autofocus () {
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    }
  },
  mounted () {
  }
}
</script>
<style lang="less">
  .botInput {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 17px 0 10px;
    box-sizing: border-box;
    .inputBox {
      margin-right: 15px;
      height: 39px;
      background: rgba(248,248,248,1);
      border-radius: 19px;
      border: 1px solid rgba(237,237,237,1);
      flex: 1;
      padding: 0 14px;
      input {
        width: 100%;
        height: 100%;
        border: none;
        font-size: 30px; /*px*/
        font-weight: 300;
      }
    }
    .btn {
      color: #D7AB70;
      font-size: 30px; /*px*/
    }
  }
</style>