<template>
  <div class="playIcon" ref="videoBox" @click.stop="playVedio(url)">
    <i class="icon iconfont icon-play_vidio" v-show="videoIndex !== index || isPaused"></i>
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
    url () {}
  },
  computed: {
    ...mapState({
      videoIndex: state => state.global.videoIndex
    }),
    isPaused () {
      if (this.videoIndex !== this.index) return
      if (this.playing) {
        return true
      } else {
        return false
      }
    }
  },
  data () {
    return {
      playing: false,
      curIndex: null
    }
  },
  methods: {
    ...mapActions([
      'updata_videoIndex'
    ]),
    playVedio (videoUrl) {
      if (this.videoIndex !== this.index) {
        this.updata_videoIndex(this.index)
        if (window.video) {
          let HTMLCollection = document.getElementsByTagName('video')
          for (let i = 0; i < HTMLCollection.length; i++) {
            HTMLCollection[i].parentNode.removeChild(HTMLCollection[i])
          }
        }
        this.$refs.videoBox.appendChild(window.video)
        window.video.src = videoUrl
        window.video.play()
      } else {
        if (window.video.paused) {
          window.video.play()
        } else {
          window.video.pause()
        }
      }
    }
  },
  mounted () {
    var video = document.createElement('video')
    video.setAttribute('id', 'video')
    video.setAttribute('x5-playsinline', '')
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')
    video.setAttribute('style', 'width:auto;height:100%;margin:0 auto;display:block;')
    window.video = video
    window.video.addEventListener('pause', () => {
      this.playing = false
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