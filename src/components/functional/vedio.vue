<template>
  <div class="playIcon" @click.stop="play(url)">
    <i class="icon iconfont icon-play_vidio"></i>
  </div>
</template>
<script>
export default {
  props: {
    url: {
      type: String
    }
  },
  data () {
    return {}
  },
  methods: {
    play (videoUrl) {
      window.video.src = videoUrl
      window.video.play()
    },
    videoObj () {
      var video = document.createElement('video')
      video.controls = 'controls'
      video.style.position = 'fixed'
      video.style.left = '0'
      video.style.top = '50%'
      video.style.transform = 'translateY(-50%)'
      video.style.width = '100%'
      video.style.zIndex = '9999'
      window.video = video
    }
  },
  created () {
    this.videoObj()
  }
}
</script>
<style lang="less">
  .playIcon{
    box-sizing: border-box;
    width: 90px;
    height: 90px;
    position: absolute;
    margin-left: 3px;
    top: 0;
    left: 0;
    z-index: 9998;
    background-color: #000000;
    i{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      font-size: 20px;
      color: #FFFFFF;
      z-index: 9999;
    }
  }
</style>