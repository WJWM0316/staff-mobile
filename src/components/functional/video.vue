<template>
  <div class="playIcon" ref="videoBox" @click.stop="playVedio(url)">
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
  watch: {
    url () {}
  },
  data () {
    return {}
  },
  methods: {
    playVedio (videoUrl) {
      this.$emit('play')
      if (document.getElementById('video')) {
        document.removeChild(document.getElementById('video'))
      }
      var video = document.createElement('video')
      window.video = video
      video.setAttribute('id', 'video')
      video.setAttribute('style', 'width:auto;height:100%;margin:0 auto;display:block;')
      this.$refs.videoBox.appendChild(window.video)
      window.video.src = videoUrl
      window.video.play()
    }
  },
  created () {
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