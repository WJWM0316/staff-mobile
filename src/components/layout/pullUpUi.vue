<template>
   <div class="loading-pos" ref="pullUpTip" v-show="isShow">
    <div class="loading-container" v-show="pullUpStatus && !noData">
      <img class="loadmore" src="@/assets/icon/loadMore.gif">
    </div>
    <p class="loading-connecting" v-show="noData && isShowNoDataText">没有更多数据</p>
  </div>
</template>
<script>
export default {
  props: {
    pullUpStatus: {
      type: Boolean,
      default: false
    },
    noData: {
      type: Boolean,
      default: false
    },
    isShowNoDataText: {
      type: Boolean,
      default: true
    }
  },
  computed: {
  },
  watch: {
    pullUpStatus (val) {
      this.status = val
    },
    noData (val) {
    }
  },
  data () {
    return {
      isShow: false,
      status: false
    }
  },
  mounted () {
    let that = this
    let tabHeight = 59 * window.dpr
    let winHeight = window.screen.height * window.dpr
    window.onscroll = (e) => {
      if (window.scrollY && !this.isShow) {
        this.isShow = true
      }
      if (window.scrollY && window.scrollY + tabHeight / 4 >= document.body.clientHeight - winHeight) {
        if (!this.pullUpStatus && !this.noData) {
          this.$emit('pullUp')
          console.log('加载更多数据')
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .loading-pos {
    width: 100%;
    .loadmore {
      padding: 15px 0 30px;
      width: 34px;
      height: 12px;
      display: block;
      margin: 0 auto;
    }
    .loading-connecting {
      font-size: 14px;
      font-weight: 300;
      color: #BCBCBC;
      text-align: center;
      padding: 5px 0 35px;
    }
  }
</style>