<template>
  <div class="message-item" @click.stop="jump('detail')">
    <div class="userInfo-img" @click.stop="jump('personal')">
      <img class="headImg" :src="item.avatar.smallUrl">
    </div>
    <div class="userInfo-desc">
      <div class="desc-top">
        <div class="name">{{item.realname}}</div>
        <div class="after-name">{{item.msgAction}}了我的{{item.sourceName}}</div>
      </div>
      <!--文字-->
      <!-- mediaType 0是文本，1是文件， 2是图片， 3是音频， 4是视频， 5是链接 -->
      <div class="desc-middle" v-if="item.mediaType === 0 && item.abstract">{{item.abstract}}</div>
      <!--音频-->
      <audioBox v-if="item.mediaType === 3" :messageData="item"></audioBox>
      <div class="desc-middle-return">
        <img class="icon-zhuang" src="@a/icon/icon_original.png">
        <div class="desc-middle-return-two">
          <span v-if="item.sourceType !== 0">{{typeStr[item.sourceType]}} </span>
          {{item.sourceDesc}}
        </div>
      </div>
      <div class="desc-bottom">
        <div class="send-time">{{item.createdAt | date('MM-DD HH:mm')}}</div>
        <div class="linght-house">
          <span>{{msgType[item.sourceFrom]}} {{item.title}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import audioBox from '@c/functional/audio'
export default {
  components: {
    audioBox
  },
  computed: {
    circleId () {
      return String(this.item.beReturnedId)
    }
  },
  props: {
    item: {
      type: Object,
      twoWay: true
    },
    // 对象下标
    itemIndex: {
      type: Number
    }
  },
  data () {
    return {
      audio: '',
      audioTimer: '',
      video: '',
      currVideoIndex: '',
      isAudio: true,
      typeStr: ['文本', '文件', '图片', '音频', '视频', '链接'],
      msgType: ['[圈]', '[圈]', '[课]', '[课]', '[直]']
    }
  },
  methods: {
    jump (type) {
      if (type === 'detail') {
        switch (this.item.sourceFrom) {
          case 0:
            this.$router.push(`/postDetail?id=${this.item.sourceId}`)
            break
          case 1:
            this.$router.push(`/postDetail?id=${this.item.sourceId}`)
            break
          case 2:
            this.$router.push(`/punchDetail?id=${this.item.sourceId}`)
            break
          case 3:
            this.$router.push(`/punchDetail?id=${this.item.sourceId}`)
            break
          case 4:
            this.$router.push(`/liveRoom?id=${this.item.sourceId}`)
            break
        }
      }
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>

<style lang="less">
  .message-item {
    padding: 0px 15px;
    display: flex;
    .content-audio {
      margin-top: 8px;
      width: 240px;
      height: 40px;
      position: relative;
      & .progress-container, & .audio-controller-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 0 20px 20px 20px;
      }

      & .progress-container {
        background-color: rgba(255, 226, 102, 0.4);
        overflow: hidden;
      }
      & .progress {
        background-color: #ffe266;
        height: 100%;
        width: 0;
      }

      & .audio-controller {
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
      }

      & .play .icon-play{
        display: block;
      }
      & .loading .icon-loading{
        display: block;
      }
      & .playing .icon-playing{
        display: block;
      }
      & .duration {
        color: #666666;
        font-size: 15px;
      }

      &.not-played:after {
        content: '';
        position: absolute;
        right: -8px;
        top: 0;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #ff3434;
      }
    }
    .userInfo-img {
      padding: 20px 0;
      position: relative;
      flex: 0 0 auto;
      .headImg{
        width: 50px;
        height: 50px;
        background: pink;
        border-radius: 50%;
        .sex {
          position: absolute;
          width: 18px;
          height: 18px;
          bottom: 0;
          right: 0;
          border-radius: 50%;
        }
      }
    }

    .userInfo-desc {
      margin-left: 15px;
      padding: 20px 0;
      border-bottom: 1px solid #ededed; /* no */
      flex: 1;
      overflow: hidden;
      .desc-top{
        margin-bottom: 7px;
        .setEllipsis(285px);
        .name {
          display: inline;
          font-size: 15px;
          line-height: 19px;
          font-weight: 600;
          width: 295px;
          color: #576b95;
        }
        .name-gold{
          color: #d7ab70;
        }
        .after-name{
          display: inline;
          margin-left: 5px;
          font-size: 14px;
          color: #929292;
          }
        }
      .desc-middle{
        .setEllipsisLn(4);
      }
      .desc-middle-return{
        display: flex;
        align-items: center;
        font-size: 13px;
        margin-top: 7px;
        color: #929292;
        .desc-middle-return-text{
          .setEllipsis(265px);
          height: 20px;
        }
        .desc-middle-return-text-long{
          .setEllipsis(265px);
          height: 20px;
        }
        .desc-middle-return-two{
          font-size: 13px
        }
      }
      .desc-bottom{
        font-size: 13px;
        color: #929292;
        margin-top: 7px;
        display: flex;
        justify-content: space-between;
        width: 100%;
        .send-time{
          flex: 1 1 auto;
        }
        .linght-house{
          width: 130px;
          text-align: right;
          .setEllipsis(130px);
        }
      }
      .persion-info{
        padding-top: 5px;
        font-size: 13px;
        line-height: 17px;
        color: #929292;
        .setEllipsis(295px);
      }
    }
    .content-audio {
      width: 240px;
      height: 40px;
      position: relative;

      & .progress-container, & .audio-controller-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 0 20px 20px 20px;
      }

      & .progress-container {
        background-color: rgba(255, 226, 102, 0.4);
        overflow: hidden;
      }
      & .progress {
        background-color: #ffe266;
        height: 100%;
        width: 0;
      }

      & .audio-controller {
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
      }

      & .play .icon-play{
        display: block;
      }
      & .loading .icon-loading{
        display: block;
      }
      & .playing .icon-playing{
        display: block;
      }
      & .duration {
        color: #666666;
        font-size: 15px;
      }

      &.not-played:after {
        content: '';
        position: absolute;
        right: -7px;
        top: 0;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #ff3434;
      }
    }
    .not-played:after {
      content: '';
      position: absolute;
      right: -7px;
      top: 0;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #ff3434;
    }
    & .icon-zan, & .icon-pinglun {
      display: inline-block;
      width: 15px;
      height: 15px;
      margin-right: 2px;
    }
    & .icon-loading, & .icon-play, & .icon-playing {
      display: none;
      width: 18px;
      height: 18px;
    }
    & .rotateZ {
      animation: rotateZ linear 1s infinite;
    }
    .icon-zhuang{
      margin-right: 4px;
      width: 15px;
      height: 15px;
    }
  }
</style>
