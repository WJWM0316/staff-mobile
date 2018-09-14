<template>
  <div id="app-box" v-cloak>
    <div id="page" @touchmove="touchMove" @touchstart="touchStart" @touchend="touchEnd" :style="{'transform' : `translate3d(0, ${moveY}px, 0)`}">
      <div class="pulldown-tip" ref="pulldownTip">
        <img class="pull-icon" src="@/assets/icon/loading.png" alt="">
      </div>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
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
import { mapState } from 'vuex'
import './util/lib-flexible/flexible'
export default {
  components: {
    Tabbar,
    TabbarItem
  },
  computer: {
    ...mapState([userInfo])
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
          src: '/course/index',
          label: '选课'
        },
        {
          icon: require('./assets/tab/tab_job@3x.png'),
          selectIcon: require('./assets/tab/tab_job_pre@3x.png'),
          src: '/workCircle/index',
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
    }
  },
  methods: {
    selectTab (n) {
      this.tabIndex = n
    },
    touchStart (e) {
      if (window.scrollY === 0) {
        this.startY = e.touches[0].clientY
      }
    },
    touchMove (e) {
      if (window.scrollY === 0) {
        this.moveY = e.touches[0].clientY - this.startY
      }
    },
    touchEnd (e) {
      if (window.scrollY === 0) {
        this.moveY = e.changedTouches[0].clientY - this.startY
        if (this.moveY > 60) {
          this.pullDown = true
          this.moveY = this.$refs.pulldownTip.clientHeight
          if (this._refresh()) {
            this._refresh().then(res => {
              console.log(res, 1111111111)
              setTimeout(res0 => {
                this.moveY = 0
              }, 500)
            }).catch(e => {
              this.moveY = 0
            })
          } else {
            setTimeout(res0 => {
              this.moveY = 0
              window.location.reload()
            }, 100)
          }
        }
      }
    },
    _refresh () {},
    getUserInfo () {
      return userInfoApi('', false).then(res => {
        return Promise.resolve(res)
      })
    }
  },
  created () {
    console.log(this.userInfo)
    this.getUserInfo()
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
  #page {
    min-height: 100vh;
    position: relative;
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
  }
  .pull-icon {
    width: 30px;
    height: 30px;
    display: block;
    margin: 0 auto;
    animation: rotate 1s linear infinite;
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
