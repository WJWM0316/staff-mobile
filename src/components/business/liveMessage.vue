<template>
  <div class="live-message">
    <div class="avatar">
      <img :src="messageData.avatar.middleUrl" alt="">
    </div>
    <div class="message-con">
      <div class="name">{{messageData.realname}}</div>
      <div class="textType" v-if="messageData.type === 'text'" :style="{background: bgColor}">{{messageData.content}}</div>
      <audio-message
        v-if="messageData.type === 'audio'"
        :messageData="messageData"
        :audioList="audioList"
        @nextMusic='nextMusic'
      ></audio-message>
    </div>
  </div>
</template>
<script>
import audioMessage from '@c/functional/audio'
export default {
  components: {
    audioMessage
  },
  props: {
    bgColor: {
      type: String,
      default: '#ffffff'
    },
    audioList: {
      type: Array,
      default: () => {
        return []
      }
    },
    messageData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    audioList () {},
    messageData () {}
  },
  methods: {
    nextMusic (index) {
      this.$emit('nextMusic', index)
    }
  }
}
</script>
<style lang="less" scoped>
  .live-message {
    padding: 0 20px;
    overflow: hidden;
    padding-bottom: 25px;
    &::last-child {
      margin-bottom: 0;
    }
    .avatar {
      width: 32px;
      height: 32px;
      float: left;
      margin-right: 10px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .message-con {
      max-width: 262px;
      font-weight: 400;
      float: left;
      .name {
        color: #929292;
        font-size: 24px; /*px*/
        line-height: 16px;
        margin-bottom: 5px;
      }
      .textType {
        padding: 9px 15px;
        font-size: 15px;
        line-height: 22px;
        color: #354048;
        background: #fff;
        border-radius: 3px;
      }
    }
  }
</style>