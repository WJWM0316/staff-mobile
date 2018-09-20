<template>
  <div ref="wrapper" class="better-scroll-root">  <!--该节点需要定位，内容以此节点的盒模型为基础滚动。另外，该节点的背景色配合上拉加载、下拉刷新的UI，正常情况下不可作它用。-->
    <div class="content-bg better-scroll-container" :style="{background: bgColor}">  <!--如果需要调滚动内容的背景色，则改该节点的背景色-->
      <div class="content-wrap"> <!--不太需要，待优化-->
        <div class="pulldownTip" ref="pulldown" :class="{'showStatus' : pulldownUi}" v-if="pulldown">
          <img class="pull-icon" src="../../assets/icon/loading.png" v-if="downType === 'refresh'">
          <img class="loadmore" src="../../assets/icon/loadMore.gif" v-else>
        </div>
        <div class="content" :class="{'pulldownUi': pulldownUi}">
          <slot></slot>
        </div>
        <div class="loading-pos" v-if="pullup && pullupUi" :class="{'pullupUi' : pullupUi}">
          <div class="loading-container" v-if="!noData">
            <img class="loadmore" src="../../assets/icon/loadMore.gif">
          </div>
          <p class="loading-connecting" v-else>没有更多数据</p>
        </div>
      </div>
    </div>
</div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
  props: {
    /**
     * 1 滚动的时候会派发scroll事件，会截流。
     * 2 滚动的时候实时派发scroll事件，不会截流。
     * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
     */
    probeType: {
      type: Number,
      default: 2
    },
    /**
     * 下拉的类型
     */
    downType: {
      type: String,
      default: 'refresh'
    },
    /**
     * 点击列表是否派发click事件
     */
    click: {
      type: Boolean,
      default: true
    },
    /**
     * 是否开启横向滚动
     */
    scrollX: {
      type: Boolean,
      default: false
    },
    /**
     * 是否派发滚动事件
     */
    listenScroll: {
      type: Boolean,
      default: false
    },
    /**
     * 列表的数据
     */
    list: {
      type: Array,
      default: null
    },
    /**
     * 是否派发滚动到底部的事件，用于上拉加载
     */
    pullup: {
      type: Boolean,
      default: false
    },
    /**
     * 是否派发顶部下拉的事件，用于下拉刷新
     */
    pulldown: {
      type: Boolean,
      default: false
    },
    /**
     * 是否派发列表滚动开始的事件
     */
    beforeScroll: {
      type: Boolean,
      default: false
    },
    /**
     * 当数据更新后，刷新scroll的延时。
     */
    refreshDelay: {
      type: Number,
      default: 20
    },
    /**
     * 没有更多数据
     */
    noData: {
      type: Boolean,
      default: false
    },
    /**
     * 背景颜色赋值
     */
    bgColor: {
      type: String,
      default: '#ffffff'
    },
    /**
     * 是否保留原始的水平滚动
     */
    freeScroll: {
      type: Boolean,
      default: false
    },
    /**
     * 是否开启回弹动画
     */
    bounce: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    click () {},
    scrollX () {},
    listenScroll () {},
    pullup () {},
    pulldown () {},
    beforeScroll () {},
    refreshDelay () {},
    noData (val) {
      console.log(val)
    },
    bgColor () {},
    freeScroll () {},
    // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
    list () {
      setTimeout(() => {
        this.scroll.finishPullUp()
        this.refresh()
      }, this.refreshDelay)
    }
  },
  data () {
    return {
      pulldownUi: false,
      pullupUi: true
    }
  },
  mounted () {
    // 保证在DOM渲染完毕后初始化better-scroll
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      // better-scroll的初始化
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        scrollX: this.scrollX,
        bounce: {
          top: this.bounce,
          bottom: this.bounce,
          left: this.bounce,
          right: this.bounce
        },
        preventDefaultException: {
          tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
        },
        mouseWheel: {
          speed: 20,
          invert: false,
          easeTime: 300
        },
        pullUpLoad: this.pullup,
        freeScroll: this.freeScroll
      })

      // 是否派发滚动事件
      if (this.listenScroll || this.pulldown || this.pullup) {
        let me = this
        this.scroll.on('scroll', (pos) => {
          if (this.listenScroll) {
            if (!this.pullupUi) {
              this.pullupUi = true
            }
            me.$emit('scroll', pos)
          }
          if (this.pulldown) {
          }

          if (this.pullup) {
          }
        })
      }
      // 是否派发滚动到底部事件，用于上拉加载
      if (this.pullup) {
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUp', this.scroll)
        })
      }

      // 是否派发顶部下拉事件，用于下拉刷新
      if (this.pulldown) {
        this.scroll.on('touchEnd', (pos) => {
          if (pos.y > 100) {
            this.pulldownUi = true
            this.$emit('pullingDown', this.scroll)
          }
        })
      }

      // 是否派发列表滚动开始的事件
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    disable () {
      // 代理better-scroll的disable方法
      this.scroll && this.scroll.disable()
    },
    enable () {
      // 代理better-scroll的enable方法
      this.scroll && this.scroll.enable()
    },
    refresh () {
      // 代理better-scroll的refresh方法
      this.scroll && this.scroll.refresh()
    },
    scrollTo (x, y, time, easing) {
      // 代理better-scroll的scrollTo方法
      this.scroll && this.scroll.scrollTo(x, y, time, easing)
    },
    scrollToElement (el, time, offsetX, offsetY, easing) {
      // 代理better-scroll的scrollToElement方法
      this.scroll && this.scroll.scrollToElement(el, time, offsetX, offsetY, easing)
    }
  }
}
</script>
<style lang="less" scoped>
.better-scroll-root {
    overflow: hidden;
    .better-scroll-container {
      position: relative;
    }
    .content-wrap {
      position: relative;
    }
    .content {
      &.pulldownUi {
        padding-top: 54px;
      }
    }
    .loading-pos {
      width: 100%;
      opacity: 0;
      background: none;
      &.pullupUi {
        opacity: 1;
      }
      .loading-container {
      }
      .loadmore {
        padding: 15px 0 30px;
        width: 34px;
        height: 12px;
        display: block;
        margin: 0 auto;
      }
      .loading-connecting {
        font-size: 28px; /*px*/
        font-weight: 300;
        color: #BCBCBC;
        text-align: center;
        padding: 15px 0 35px;
      }
    }
    .pulldownTip {
      height: 54px;
      width: 100%;
      line-height: 54px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      left: 0;
      top: -54px;
      background: none;
      &.showStatus {
        top: 0;
      }
      .pull-icon {
        width: 26px;
        height: 26px;
        display: block;
        margin: 0 auto;
        animation: loading 1s linear infinite;
      }
      .loadmore {
        padding: 27px 0 15px;
        width: 34px;
        height: 12px;
        display: block;
        margin: 0 auto;
      }
    }
    @keyframes loading {
      0 { transform: rotate(0); }
      100% { transform: rotate(360deg); }
    }
}
</style>