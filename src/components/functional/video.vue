<template>
  <div class="videoBox">
    <template>
      <div class="playIcon" ref="videoBox" @click.stop="playVideo(url)" :class="{'square': type==='square', 'horizontal': type==='horizontal' && !vertical, 'vertical': type==='vertical' || (vertical && type !=='square')}">
        <i class="icon iconfont icon-play_vidio"></i>
      </div>
    </template>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import browser from '@u/browser'
export default {
  props: {
    url: {
      type: String
    },
    index: {
      type: Number
    },
    type: {
      type: String,
      default: 'square'
    }
  },
  watch: {
    index () {},
    url () {},
    type () {},
    vertical () {}
  },
  computed: {
    ...mapState({
      videoIndex: state => state.global.videoIndex
    }),
    isPaused () {
      if (this.curIndex !== this.videoIndex) return
      if (this.playOver) {
        return true
      } else {
        return false
      }
    }
  },
  data () {
    return {
      playOver: false,
      vertical: false // 是否为竖版
    }
  },
  methods: {
    ...mapActions([
      'updata_videoIndex'
    ]),
    playVideo (videoUrl) {
      let fullscreenPlay = () => {
        this.playOver = true
        // 兼容pc全屏播放
        // if (window.video.requestFullscreen) {
        //   window.video.requestFullscreen()
        // } else if (window.video.mozRequestFullScreen) {
        //   window.video.mozRequestFullScreen()
        // } else if (window.video.webkitRequestFullScreen) {
        //   window.video.webkitRequestFullScreen()
        // }
        try {
          window.video.play()
        } catch (e) {
          console.log(e)
          window.video.play()
        }
      }
      if (this.videoIndex !== this.index) {
        if (window.video) {
          let HTMLCollection = document.getElementsByTagName('video')
          for (let i = 0; i < HTMLCollection.length; i++) {
            HTMLCollection[i].parentNode.removeChild(HTMLCollection[i])
          }
        }
        window.video.src = videoUrl
        this.$refs.videoBox.appendChild(window.video)
        setTimeout(() => {
          fullscreenPlay()
        }, 100)
      } else {
        if (window.video.paused) {
          fullscreenPlay()
        } else {
          window.video.pause()
        }
      }
      this.updata_videoIndex(this.index)
      if (browser.isAndroid()) {
        if (this.type !== 'square') {
          let timeupdate = () => {
            if (this.videoIndex === this.index) {
              if (window.video.clientHeight > window.video.clientWidth && window.video.getAttribute('style')) {
                this.vertical = true
                window.video.setAttribute('style', 'width:100%;height:auto;margin:0 auto;display:block;object-fit: cover;object-position: center center;')
              } else {
                window.video.setAttribute('style', 'width:auto;height:100%;margin:0 auto;display:block;object-fit: cover;object-position: center center;')
              }
            }
          }
          window.video.removeEventListener('timeupdate', timeupdate)
          window.video.addEventListener('timeupdate', timeupdate)
        } else {
          window.video.setAttribute('style', 'width:auto;height:100%;margin:0 auto;display:block;object-fit: cover;object-position: center center;')
        }
      } else {
        window.video.setAttribute('style', 'width:auto;height:100%;margin:0 auto;display:block;object-fit: cover;object-position: center center;')
      }
    }
  },
  mounted () {
    var video = document.createElement('video')
    if (browser.isAndroid()) {
      video.setAttribute('x5-playsinline', true)
      video.setAttribute('webkit-playsinline', true)
      video.setAttribute('playsinline', true)
      video.setAttribute('x-webkit-airplay', true)
      video.setAttribute('x5-video-ignore-metadata', true)
      video.setAttribute('x5-video-player-fullscreen', true)
    }
    video.setAttribute('id', 'video')
    window.video = video
  }
}
</script>
<style lang="less" scoped>
  .playIcon{
    box-sizing: border-box;
    background-color: #000000;
    &.square {
      width: 90px;
      height: 90px;
    }
    &.horizontal {
      width: 335px;
      height: 187px;
    }
    &.vertical {
      width: 187px;
      height: 335px;
    }
    i {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      font-size: 70px;/*px*/
      color: #FFFFFF;
      z-index: 9999;
    }
    #video {
      margin: 0 auto;
      display: block;
    }
  }
  .newMask {
    width: 90px;
    height: 90px;
    position: relative;
    .playIcon {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }
    .littleVideo {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      display:block;
      object-fit: cover;
      object-position: center center;
    }
  }
</style>