<template>
   <div class="loading-pos" ref="pullUpTip" v-show="show">
    <div class="loading-container" v-show="pullUpStatus && !noData">
      <img class="loadmore" src="@/assets/icon/loadMore.gif">
    </div>
    <p class="loading-connecting" v-show="!pullUpStatus && noData && list.length > 0">没有更多内容了~</p>
  </div>
</template>
<script>
let scrollFun = null
export default {
  props: {
    pullUpStatus: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    noData: {
      type: Boolean,
      default: false
    }
  },
  computed: {
  },
  watch: {
    pullUpStatus (val) {
    },
    noData (val) {
    }
  },
  data () {
    return {
      status: false,
      show: false
    }
  },
  mounted () {
    let that = this
    this.tabHeight = 59 * window.dpr
    this.winHeight = window.screen.height * window.dpr
    scrollFun = () => {
      this.show = true
      if (window.scrollY && window.scrollY + this.tabHeight / 4 >= document.body.clientHeight - this.winHeight) {
        if (!this.pullUpStatus && !this.noData) {
          this.$emit('pullUp')
          console.log('加载更多数据')
        }
      }
    }
    window.removeEventListener('scroll', scrollFun)
    window.addEventListener('scroll', scrollFun)
  },
  destroyed () {
    window.removeEventListener('scroll', scrollFun)
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
      padding: 20px 0 20px;
    }
  }
</style>