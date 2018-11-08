<template>
  <!-- 悬浮输入框 -->
  <div class="suspension-input" :class="{ 'z-focused': isFocused }" v-show="isShow">
    <div class="ask-box">
      <div class="user-input">
        <!--<input type="text"
               :placeholder="placeholder"
               v-model="suspensionInputContent"
               @blur="hide()"
               @focus="handleFocus"
               ref="suspension-input"
               maxlength="1999"
                />-->
        <textarea :rows="rows"
          cols="40"
          v-model="suspensionInputContent"
          maxlength="1999"
          ref="suspension-input"
          @focus="handleFocus"
          @blur="hide()"
          :placeholder="placeholder"></textarea>
      </div>
      <span class="ask-btn" @click="send">{{sendText}}</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .suspension-input {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
    /*overflow-y: scroll;*/
    -webkit-overflow-scrolling: touch;
    background-color: #f8f8f8;
    &.z-focused {
      padding-bottom: 33px;
    }
    .ask-box {
      max-height: 174px;
      min-height: 54px;
      padding: 7px 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      & .user-input {
        margin-top: 0;
        width: 315px;
        min-height: 40px;
        max-height: 160px;
        border-radius: 20px;
        background-color: #fff;
        font-size: 14px;
        padding: 0 10px;
        & input {
          line-height: 39px;
          width: 100%;
          height: 100%;
          border-style: none;
          outline: none;
        }
        textarea{
          font-size: 30px;/*px*/
          line-height: 39px;
          width: 100%;
          height: 200%;
          border-style: none;
          outline: none;
          color: #354048;
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
    value: {
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
      isFocused: false,
      rows: 1
    }
  },
  watch: {
    suspensionInputContent (val) {
      if (val.length > 17 && val.length < 34) {
        this.rows = 2
      } else if (val.length > 34 && val.length < 51) {
        this.rows = 3
      } else if (val.length > 51) {
        this.rows = 4
      } else {
        this.rows = 1
      }
    },
    isShow (val) {},
    value (val) {
      if (val && this.suspensionInput) {
        this.$nextTick(() => {
          this.$refs['suspension-input'].focus()
        })
      }
    },
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
    hide () {
      this.isFocused = false
      this.$emit('input', false)
    },
    handleFocus () {
      this.$emit('focus')
      this.isFocused = true
    }
  },
  mounted () {
    this.suspensionInput = this.$refs['suspension-input']
  }
}
</script>
