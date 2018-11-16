<template>
  <div class="playIcon" ref="videoBox" @click.stop="playVedio(url)">
    <i class="icon iconfont icon-play_vidio"></i>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: {
    url: {
      type: String
    },
    index: {
      type: Number
    }
  },
  watch: {
    index () {
    },
    url () {},
    playOver (val) {
      console.log(333333, val, this.videoIndex, this.curIndex, this.videoIndex === this.curIndex && this.playOver)
    }
  },
  computed: {
    ...mapState({
      videoIndex: state => state.global.videoIndex
    }),
    isPaused () {
      if (this.curIndex !== this.videoIndex) return
      console.log(this.curIndex, 11111111)
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
      curIndex: 0
    }
  },
  methods: {
    ...mapActions([
      'updata_videoIndex'
    ]),
    playVedio (videoUrl) {
      this.curIndex = this.index
      let fullscreen = () => {
        if (window.video.requestFullscreen) {
          window.video.requestFullscreen()
        } else if (window.video.mozRequestFullScreen) {
          window.video.mozRequestFullScreen()
        } else if (window.video.webkitRequestFullScreen) {
          window.video.webkitRequestFullScreen()
        }
      }
      if (this.videoIndex !== this.index) {
        if (window.video) {
          let HTMLCollection = document.getElementsByTagName('video')
          for (let i = 0; i < HTMLCollection.length; i++) {
            HTMLCollection[i].parentNode.removeChild(HTMLCollection[i])
          }
        }
        this.$refs.videoBox.appendChild(window.video)
        window.video.src = videoUrl
        window.video.play()
        fullscreen()
      } else {
        if (window.video.paused) {
          this.playOver = false
          window.video.play()
          fullscreen()
        } else {
          window.video.pause()
        }
      }
      this.updata_videoIndex(this.index)
    }
  },
  mounted () {
    var video = document.createElement('video')
    video.setAttribute('id', 'video')
    video.setAttribute('style', 'width:auto;height:100%;margin:0 auto;display:block;object-fit: cover;object-position: center center;')
    window.video = video
    window.video.addEventListener('pause', () => {
      this.playOver = true
    })
  }
}
</script>
<style lang="less" scoped>
  .playIcon{
    box-sizing: border-box;
    width: 90px;
    height: 90px;
    background-color: #000000;
    i{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      font-size: 70px;/*px*/
      color: #FFFFFF;
      z-index: 9999;
    }
    #video {
      width: auto;
      height: 100%;
      margin: 0 auto;
      display: block;
    }
  }
</style>