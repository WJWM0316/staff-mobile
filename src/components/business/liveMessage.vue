<template>
  <div class="live-message" v-if="messageData">
    <div class="avatar">
      <img :src="messageData.avatar && messageData.avatar.smallUrl">
    </div>
    <div class="message-con">
      <div class="name">{{messageData.realname}}</div>
      <div class="textType" v-if="messageData.type === 'text'" :style="{background: bgColor}">{{messageData.content}}</div>
      <audio-message
        v-if="messageData.type === 'audio'"
        :messageData="messageData"
        :audioList="audioList"
        :key="messageData.messageId"
        :isNeedRead='isNeedRead'
        :isNeedEnd='isNeedEnd'
        @curPlayMusic='curPlayMusic'
        @removeRed="removeRed"
        @nextMusic='nextMusic'
        @endAudio='endAudio'
      ></audio-message>
      <img
        class="imgPriview"
        v-if="messageData.type === 'img'"
        @load.stop="imgLoad"
        :class="{'vertical': isVertical}"
        :src="messageData.file.middleUrl"
        :data-src="messageData.file.url">
    </div>
  </div>
</template>
<script>
import { removeRedApi, endAudioApi } from '@/api/pages/live'
import audioMessage from '@c/functional/audio'
export default {
  components: {
    audioMessage
  },
  props: {
    isNeedRead: { // 是否需要红点标识
      type: Boolean,
      default: false
    },
    isNeedEnd: { // 是否需要已结束标识
      type: Boolean,
      default: false
    },
    bgColor: {
      defaultImg: String,
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
  data () {
    return {
      isLoad: false, // 是否加载完毕
      isVertical: false // 是否是竖版图片
    }
  },
  watch: {
    audioList () {},
    messageData () {}
  },
  methods: {
    imgLoad (e) {
      this.isLoad = true
      if (e.target.width < e.target.height) {
        this.isVertical = true
      }
      this.$emit('imgLoadEnd', e)
    },
    // 消除音频红点
    removeRed () {
      let data = {
        liveId: this.$route.query.id,
        messageId: this.messageData.messageId
      }
      removeRedApi(data)
    },
    // 音频播放完毕记录
    endAudio () {
      let data = {
        liveId: this.$route.query.id,
        messageId: this.messageData.messageId
      }
      endAudioApi(data)
    },
    // 当前播放音频
    curPlayMusic (index) {
      this.$emit('curPlayMusic', index)
    },
    // 一下个播放音频
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
      font-weight: 300;
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
      .imgPriview {
        width: 180px;
        display: block;
        border-radius: 3px;
        &.vertical {
          width: 135px;
        }
      }
    }
  }
</style>