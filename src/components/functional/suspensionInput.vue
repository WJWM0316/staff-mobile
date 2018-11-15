<template>
  <!-- 悬浮输入框 -->
  <div class="suspension-input" :class="{'allHeight': isFocused}" v-show="isShow">
    <div class="mask" v-show="isFocused" @click="blurFun"></div>
    <div class="ask-box">
      <div class="user-input" ref="user-input">
        <!-- <input type="text"
               :placeholder="placeholder"
               v-model="suspensionInputContent"
               v-focus
               ref="suspension-input"
               maxlength="1999"
                /> -->
        <textarea
          v-model="suspensionInputContent"
          v-focus
          maxlength="1999"
          ref="suspension-input"
          @focus.stop="hasFocus"
          @blur.stop="hasBlur"
          :placeholder="placeholder"></textarea>
      </div>
      <span class="ask-btn" @click="send">{{sendText}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'suspension-input',
  props: {
    placeholder: String,
    sendText: String,
    commentIndex: Number,
    isShow: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      suspensionInputContent: '',
      suspensionInput: '',
      isFocused: false
    }
  },
  watch: {
    suspensionInputContent (val) {
      let elem = this.suspensionInput
      elem.setAttribute('style', '')
      elem.scrollTop = 0 // 防抖动
      elem.style.height = elem.scrollHeight + 'px'
      this.$refs['user-input'].scrollTop = 1000 // 确保输入的内容能够在最底部
    },
    isShow (val) {},
    commentIndex (index, oldIndex) {
      if (index !== oldIndex) {
        this.suspensionInputContent = ''
      }
    },
    content (val) {
      this.suspensionInputContent = val
    }
  },
  methods: {
    send () {
      const value = this.suspensionInputContent
      const commentIndex = this.commentIndex
      if (!value) {
        this.$vux.toast.text('内容不能为空', 'bottom')
        return
      }
      this.$emit('send', {
        value,
        commentIndex
      })
      this.suspensionInputContent = ''
    },
    hasFocus () {
      this.isFocused = true
    },
    hasBlur () {
      this.isFocused = false
    },
    blurFun () {
      this.suspensionInput.blur()
    }
  },
  mounted () {
    this.suspensionInput = this.$refs['suspension-input']
  }
}
</script>
<style lang="less" scoped>
  .suspension-input {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
    -webkit-overflow-scrolling: touch;
    display: flex;
    align-items: flex-end;
    &.allHeight {
      height: 100vh;
    }
    .mask {
      height: 100vh;
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 1;
    }
    .ask-box {
      height: 54px;
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 2;
      padding: 6px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #f8f8f8;
      box-sizing: border-box;
      & .user-input {
        margin-top: 0;
        width: 315px;
        max-height: 95px;
        border-radius: 20px;
        background-color: #fff;
        font-size: 14px;
        padding: 0 10px;
        overflow-y: scroll;
        box-sizing: border-box;
        & input {
          line-height: 39px;
          width: 100%;
          height: 100%;
          border-style: none;
          outline: none;
          display: block;
          font-weight: 300;
        }
        textarea{
          font-size: 30px;/*px*/
          padding: 8.5px 0;
          width: 100%;
          height: 39px;
          line-height: 22px;
          box-sizing: border-box;
          border-style: none;
          font-weight: 300;
          outline: none;
          color: #354048;
          display: block;
        }
      }
      & .ask-btn {
        flex: 0 0 auto;
        margin-right: -10px;
        padding: 0 10px;
        border-radius: 0;
        font-size: 15px;
        font-weight: 700;
        color: #d7ab70;
      }
    }
  }
</style>
