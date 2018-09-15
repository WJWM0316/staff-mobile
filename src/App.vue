<template>
  <div id="app-box" v-cloak :class="{'hasTab' : $route.meta.needBottomTab}">
    <div id="page" @touchmove="touchMove" @touchstart="touchStart" @touchend="touchEnd" :style="{'transform' : `translate3d(0, ${moveY}px, 0)`}">
      <div class="pulldown-tip" ref="pulldownTip" v-show="$route.meta.pullDown">
        <img class="pull-icon" src="@/assets/icon/loading.png" alt="">
      </div>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
      <div class="loading-pos" ref="pullUpTip">
        <div class="loading-container">
          <img class="loadmore" src="@/assets/icon/loadMore.gif">
        </div>
<!--         <p class="loading-connecting" v-else>没有更多数据</p>
 -->      </div>
    </div>
    <tabbar slot="bottom" class="bottomTab"  v-show="$route.meta.needBottomTab" v-model="tabIndex">
      <tabbar-item
        v-for="(tab, index) in tabList"
        :selected="index === tabIndex"
        :key="index"
        @on-item-click="selectTab(index)"
        >
        <img slot="icon" class="icon" :src="tab.icon">
        <img slot="icon-active"  class="icon" :src="tab.selectIcon">
        <span slot="label"  class="txt">{{tab.label}}</span>
      </tabbar-item>
    </tabbar>
    <div class="loading" v-show="$store.getters.loadingStatus">
      <div class="loadBox">
        <div class="icon">
          <img src="@/assets/icon/loading.png" alt="">
        </div>
        <p class="txt">{{$store.getters.loadingTxt}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { userInfoApi } from '@/api/pages/center'
import { Tabbar, TabbarItem } from 'vux'
import { mapState, mapActions } from 'vuex'
import './util/lib-flexible/flexible'
export default {
  components: {
    Tabbar,
    TabbarItem
  },
  data () {
    return {
      tabIndex: 0,
      tabList: [
        {
          icon: require('./assets/tab/tab_lighthouse@3x.png'),
          selectIcon: require('./assets/tab/tab_lighthouse_pre@3x.png'),
          src: '/home',
          label: '首页'
        },
        {
          icon: require('./assets/tab/tab_class@3x.png'),
          selectIcon: require('./assets/tab/tab_class_pre@3x.png'),
          src: '/course',
          label: '选课'
        },
        {
          icon: require('./assets/tab/tab_job@3x.png'),
          selectIcon: require('./assets/tab/tab_job_pre@3x.png'),
          src: '/workCircle',
          label: '工作圈'
        },
        {
          icon: require('./assets/tab/tab_me@3x.png'),
          selectIcon: require('./assets/tab/tab_me_pre@3x.png'),
          src: '/center',
          label: '我的'
        }
      ],
      startY: 0,
      moveY: 0,
      endY: 0,
      pullDown: false
    }
  },
  watch: {
    '$route' (route) {
      switch (route.name) {
        case 'home' : this.tabIndex = 0; break
        case 'course' : this.tabIndex = 1; break
        case 'workCircle' : this.tabIndex = 2; break
        case 'center' : this.tabIndex = 3; break
      }
    },
    tabIndex (index) {
      this.$router.push(this.tabList[index].src)
    },
    userInfo () {}
  },
  computed: {
    ...mapState({
      userInfo: state => state.global.userInfo,
      pullUpStatus: state => state.global.pullUpStatus,
      pullDownStatus: state => state.global.pullDownStatus
    })
  },
  methods: {
    ...mapActions([
      'updata_userInfo',
      'updata_loadingStatus',
      'updata_pullUpStatus',
      'updata_pullDownStatus'
    ]),
    selectTab (n) {
      this.tabIndex = n
    },
    touchStart (e) {
      if (window.scrollY === 0 && this.$route.meta.pullDown) {
        this.startY = e.touches[0].clientY
      }
    },
    touchMove (e) {
      let move = e.touches[0].clientY - this.startY
      if (window.scrollY === 0 && move > 0 && this.$route.meta.pullDown) {
        this.moveY = move
      }
    },
    touchEnd (e) {
      if (this.moveY !== 0 && this.$route.meta.pullDown) {
        this.moveY = e.changedTouches[0].clientY - this.startY
        if (this.moveY > 60) {
          this.pullDown = true
          this.$nextTick(() => {
            this.moveY = this.$refs.pulldownTip.clientHeight
          })
          try {
            this._refresh().then(res => {
              setTimeout(res0 => {
                this.moveY = 0
              }, 500)
            })
          } catch (e) {
            setTimeout(res0 => {
              this.moveY = 0
              window.location.reload()
            }, 500)
          }
        } else {
          this.moveY = 0
        }
      }
    },
    _refresh () {}, // 用于页面组件的下拉刷新赋值， 不可删
    _loadMore () {}, // 用于页面组件的上拉加载赋值， 不可删
    getUserInfo () {
      userInfoApi('', false).then(res => {
        this.updata_userInfo(res.data)
      })
    }
  },
  created () {
    if (!this.userInfo.id) {
      this.getUserInfo()
    }
  },
  mounted () {
    let tabHeight = this.$refs.pullUpTip.clientHeight
    let winHeight = window.screen.height * window.dpr
    window.onscroll = (e) => {
      if (window.scrollY >= document.body.clientHeight - winHeight) {
        if (!this.pullUpStatus) {
          console.log('测试111')
          this.updata_pullUpStatus(true)
          window.scrollTo(0, document.body.clientHeight - winHeight)
          console.log('加载更多数据')
        }
      }
    }
  }
}
</script>

<style lang="less">
@import "./styles/index";
@keyframes rotate {
  0 { transform: rotate(0); }
  100% { transform: rotate(360deg); }
}
#app-box {
  &.hasTab {
    padding-bottom: 49px;
  }
  #page {
    min-height: 100vh;
    position: relative;
    .pulldown-tip {
      height: 54px;
      width: 100%;
      line-height: 54px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: -54px;
      left: 0;
      .pull-icon {
        width: 30px;
        height: 30px;
        display: block;
        margin: 0 auto;
        animation: rotate 1s linear infinite;
      }
    }
    .loading-pos {
      width: 100%;
      .loading-container {
        opacity: 1;
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
        padding: 5px 0 35px;
      }
    }
  }
  .bottomTab {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 49px;
    background: #ffffff;
    .weui-tabbar__item {
      padding-top: 5px;
    }
    .weui-tabbar__label {
      margin-top: 2px;
      line-height: 10px;
    }
  }
  .loading {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999;
    .loadBox {
      width: 91px;
      height: 91px;
      background: #ffffff;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      border-radius: 3px;
      box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.08);
      .icon {
        width: 30px;
        height: 30px;
        display: block;
        margin: 0 auto;
        animation: rotate 1s linear infinite;
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
      .txt {
        color: #BCBCBC;
        font-size: 24px; /*px*/
        line-height: 24px; /*px*/
        font-weight: 300;
        text-align: center;
        margin-top: 12px;
      }
    }
  }
}
</style>
