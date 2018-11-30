<template>
  <div class="plyrPlayer">
    <div class="playBtn" v-if="!loading && !playing" @click.stop="plyrInit"><i class="icon iconfont icon-btn_play"></i></div>
    <img class="poster" v-if="!loading" :src="poster">
    <div class="loadStatus" v-if="loading"><img src="@a/icon/music_loading.png" alt=""></div>
    <div class="customvideo" :class="customvideo">
    </div>
  </div>
</template>
<script>
import Plyr from 'plyr'
export default {
  props: {
    index: {
      type: Number,
      default: 0
    },
    url: {
      type: String,
      default: ''
    },
    poster: {
      type: String,
      default: ''
    },
    isLittle: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    customvideo () {
      return `customvideo${this.index}`
    }
  },
  data () {
    return {
      curIndex: null,
      loading: false,
      playing: false
    }
  },
  methods: {
    plyrInit () {
      if (window.player) {
        this.pause()
      }
      // 获取video容器
      const videoBox = document.querySelector(`.${this.customvideo}`)
      // 清空所有子节点
      videoBox.innerHTML = ''
      // 获取属性值
      const videoWidth = parseInt(videoBox.getAttribute('width'), 10)
      const videoHeight = parseInt(videoBox.getAttribute('height'), 10)
      // video配置项
      const options = {
        fullscreen: {
          iosNative: true // 进入全屏时是否使用原生iOS全屏（建议开启）
        },
        controls: ['fullscreen']
        // 'play-large', 'duration', 'progress', 'current-time', 'fullscreen'
      }
      // 创建video标签并设置属性
      const myVideo = document.createElement('video')
      // 插入video标签
      videoBox.appendChild(myVideo)
      // video初始化
      window.player = new Plyr(`.${this.customvideo} video`, options)
      // 设置video资源文件
      window.player.source = {
        type: 'video',
        sources: [
          {
            src: this.url,
            type: 'video/mp4'
          }
        ]
      }
      window.player.once('exitfullscreen', event => {
        this.pause()
        // 清空所有子节点
        videoBox.innerHTML = ''
      })
      window.player.once('timeupdate', event => {
        if (this.loading) this.loading = false
        if (!this.playing) this.playing = true
        if (!window.player.fullscreen.active) {
          window.player.fullscreen.enter()
        }
      })
      window.player.once('pause', event => {
        this.playing = false
      })
      const contain = document.querySelector(`.${this.customvideo}`).offsetWidth
      const video = document.querySelector(`.${this.customvideo} .plyr video`)
      video.muted = false
      video.clickToPlay = true
      // plyr中ratio属性不支持h5播放器，不得已采用这种方式
      video.style.height = (contain / (videoHeight >= videoWidth ? 1 : videoWidth / videoHeight)) + 'px'
      this.play()
    },
    play () {
      if (!window.player.playing) {
        window.player.play()
        this.loading = true
      } else {
        this.pause()
      }
    },
    pause () {
      window.player.pause()
      window.player.fullscreen.exit()
    }
  },
  mounted () {
    // this.plyrInit()
  }
}
</script>
<style lang="less">
@import 'https://xplus-uploads-test.oss-cn-shenzhen.aliyuncs.com/default/plyr.css';
.plyrPlayer {
  position: relative;
  width: 100%;
  height: 100%;
  .playBtn {
    width: 35px;
    height: 35px;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    z-index: 2;
    line-height: 35px;
    text-align: center;
    .icon {
      font-size: 30px; /*px*/
      line-height: 30px; /*px*/
    }
  }
  .poster {
    width: auto;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    background: #000;
    display: block;
  }
  .loadStatus {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    z-index: 1;
    img {
      width: 100%;
      height: 100%;
      display: block;
      animation: rotate 1s linear infinite;
    }
  }
  .customvideo {
    width: 100%;
    height: 100%;
    background: #000;
    .plyr--video {
      width: 100%;
      height: 100%;
      min-width: 100%;
      max-width: 100%;
    }
    .plyr__video-wrapper {
      position: relative;
      overflow: hidden;
      width: 100%;
      height: 100%;
      video {
        position: absolute;
        width: auto;
        height: 100%;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0);
      }
    }
  }
}
</style>