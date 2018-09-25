<template>
  <div class="aduio" :class="{'isRead': isReaded, 'isReadEnd': isReadEnded}">
    <div class="playBtn" @click.stop="play">
      <img src="@a/icon/playing.png" v-show="status === 0">
      <img src="@a/icon/music_loading.png" class="load" v-show="status === 1">
      <img src="@a/icon/playing.gif" v-show="status === 2">
    </div>
    <div class="progress" ref="progress">
      <div class="realBar" :style="{'width': `${progress}%`}">
        <div class="slider"
          @touchmove.stop.prevent="touchmove"
          @touchstart.stop.prevent="touchstart"
          @touchend.stop.prevent="touchend"
          currentTime="3"
          :class="{'start': progress === 0, 'end': progress === 100, 'cursor': operation}"
        ></div>
      </div>
    </div>
    <div class="duration">111s</div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import Vue from 'vue'
export default {
  props: {
    isRead: {
      type: Boolean,
      default: true
    },
    isReadEnd: {
      type: Boolean,
      default: false
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
      audio: null,
      status: 0, // 0未播放 1加载中 2播放中
      length: 0,
      offsetX: 0,
      progress: 0,
      startX: 0,
      moveX: 0,
      endX: 0,
      isReaded: this.isRead,
      isReadEnded: this.isReadEnd,
      operation: false,
      currentTime: 0, // 当前播放进度
      duration: 0, // 音频时长
      curIndex: 0 // 当前播放音频在audioList的索引值
    }
  },
  watch: {
    audioList () {},
    messageData () {},
    audioCurIndex (val) {
      // 如果不是当前音频则暂停其他播放音频
      if (val !== this.curIndex) {
        this.audio.pause()
      }
    }
  },
  computed: {
    ...mapState({
      audioCurIndex: state => state.global.audioCurIndex
    })
  },
  methods: {
    ...mapActions([
      'updata_audioCurIndex'
    ]),
    touchstart (e) {
      this.startX = e.changedTouches[0].clientX
    },
    touchmove (e) {
      this.moveX = e.changedTouches[0].clientX - this.offsetX
      this.progress = this.moveX / this.length * 100
      this.currentTime = this.progress * 0.01 * this.audio.duration
      this.operation = true
      this.audio.pause()
      if (this.progress < 0) this.progress = 0
      if (this.progress > 100) this.progress = 100
    },
    touchend (e) {
      this.operation = false
      this.moveX = e.changedTouches[0].clientX - this.offsetX
      this.progress = this.moveX / this.length * 100
      this.audio.currentTime = this.progress * 0.01 * this.audio.duration
      this.audio.play()
    },
    play () {
      if (this.audio.paused) {
        if (!this.audio.src) {
          this.audio.src = this.messageData.path
        }
        // 消除红点
        if (this.isReaded) {
          this.isReaded = false
        }
        this.updata_audioCurIndex(this.curIndex)
        this.audio.play()
      } else {
        this.audio.pause()
      }
    }
  },
  mounted () {
    this.audio = new Audio()
    this.audioList.filter((item, index) => {
      if (this.messageData.messageId === item.messageId) {
        this.curIndex = index
        return false
      }
    })
    this.$nextTick(() => {
      this.length = this.$refs.progress.clientWidth
      this.offsetX = this.$refs.progress.offsetLeft * window.dpr
    })
    // 缓存阶段
    this.audio.addEventListener('waiting', () => {
      this.status = 1
    }, false)
    // 播放阶段
    this.audio.addEventListener('timeupdate', () => {
      if (this.status !== 2) {
        this.status = 2
      }
      this.duration = this.audio.duration
      this.progress = this.audio.currentTime / this.audio.duration * 100
    }, false)
    // 暂停监听
    this.audio.addEventListener('pause', () => {
      this.status = 0
      this.isReadEnded = true
    }, false)
    // 结束监听
    this.audio.addEventListener('ended', () => {
      this.status = 0
      if (this.audioList.length - 1 > this.curIndex) {
        this.$emit('nextMusic', this.audioList[this.curIndex + 1].index)
      }
    }, false)
  }
}
</script>
<style lang="less">
  .aduio {
    width: 213px;
    height: 40px;
    padding: 0 15px 0 10px;
    white-space: nowrap;
    background: #FFF5CA;
    border: 1px solid #FFE266;
    box-sizing: border-box;
    border-radius:0px 20px 20px 19px;
    display: flex;
    align-items: center;
    font-size: 0;
    white-space: nowrap;
    position: relative;
    &.isRead:before {
      position: absolute;
      top: 0;
      right: -10px;
      content: '';
      width: 7px;
      height: 7px;
      background: #FF3434;
      border-radius: 50%;
      overflow: hidden;
    }
    &.isReadEnd:after {
      position: absolute;
      top: 50%;
      margin-top: -6px;
      right: -26px;
      content: '';
      width: 15px;
      height: 12px;
      background: url('../../assets/icon/live_icon_playend@3x.png');
      background-size: 100% 100%;
    }
    .playBtn {
      width: 20px;
      height: 20px;
      margin-right: 10px;
      display: inline-block;
      img {
        width: 100%;
        height: 100%;
        display: block;
        &.load {
          animation: loading 1s linear infinite;
        }
      }
    }
    .progress {
      width: 125px;
      height: 3px;
      background: #fff;
      border-radius:3px;
      position: relative;
      display: inline-block;
      .realBar {
        width: 50%;
        height: 3px;
        border-radius: 3px;
        position: absolute;
        top: 50%;
        margin-top: -1.5px;
        left: 0;
        background: #FFE266;
        .slider {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.06);
          border:1px solid #F9F9F9;
          position: absolute;
          top: 50%;
          margin-top: -6px;
          right: 0;
          margin-right: -6px;
          &.start {
            margin-right: -12px;
          }
          &.end {
            margin-right: 0;
          }
          &.cursor::before {
            content: attr(currentTime);
            width: 33px;
            height: 24px;
            color: #354048;
            font-weight: 400;
            font-size: 24px; /*px*/
            line-height: 20px;
            text-align: center;
            background: url('../../assets/icon/course.png') no-repeat;
            background-size: 100% 100%;
            position: absolute;
            top: -250%;
            left: 50%;
            margin-left: -16.5px;
          }
        }
      }
    }
    .duration {
      float: right;
      font-size: 24px; /*px*/
      color: #354048;
      font-weight: 400;
      display: inline-block;
      position: absolute;
      right: 15px;
    }
  }
</style>