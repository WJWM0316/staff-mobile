<template>
  <div id="app-box" v-cloak  :class="{'hasTab' : $route.meta.needBottomTab}">
    <div id="page" ref="page" @touchmove="touchMove" @touchstart="touchStart" @touchend="touchEnd" :style="scrollY">
      <div class="pulldown-tip" ref="pulldownTip" v-show="$route.meta.pullDown">
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
import { mapState, mapActions } from 'vuex'
import { bindWxLogin, tokenLogin } from '@/api/pages/login'
import { wxLogin } from '@/api/require'
import WechatMixin from '@/mixins/wechat'
import settings from '@/config'
import ws from '@u/websocket'
import Vue from 'vue'
import localstorage from '@u/localstorage'
export default {
  mixins: [WechatMixin],
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
      pullDown: false,
      toast: {
        show: false,
        type: 'text',
        content: '',
        position: 'bottom'
      },
      comfirm: {
        show: false,
        title: '',
        content: '',
        comfirmTxt: '确定',
        cancelTxt: '取消',
        hasCancel: true
      }
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
      // 微信授权回来需要绑定
      let data = null
      if (route.query.bind_code) {
        localstorage.set('bind_code', route.query.bind_code)
        if (route.query.is_bind === '1') {
          data = {
            bind_code: this.$route.query.bind_code,
            is_bind: this.$route.query.is_bind
          }
          wxLogin(data)
        } else {
          data = {
            bind_code: this.$route.query.bind_code,
            is_bind: this.$route.query.is_bind
          }
          this.$router.push(`/login?bind_code=${data.bind_code}&is_bind=${data.is_bind}`)
        }
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
      pullDownStatus: state => state.global.pullDownStatus
    }),
    scrollY () {
      if (this.moveY !== 0 && this.$route.meta.pullDown) {
        return {
          transform: `perspective(1px) translate3d(0, ${this.moveY}px, 0)`
        }
      }
    }
  },
  methods: {
    ...mapActions([
      'updata_userInfo',
      'updata_loadingStatus',
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
        e.preventDefault() // 阻止上拉到最顶部露出网址的微信默认行为
        this.moveY = move
      }
    },
    touchEnd (e) {
      if (this.moveY !== 0 && this.$route.meta.pullDown) {
        this.moveY = e.changedTouches[0].clientY - this.startY
        if (this.moveY > 120) {
          this.pullDown = true
          this.$nextTick(() => {
            this.moveY = this.$refs.pulldownTip.clientHeight
          })
          setTimeout(res0 => {
            this.moveY = 0
            window.location.reload()
          }, 500)
        } else {
          this.moveY = 0
        }
      }
    },
    _refresh () {}, // 用于页面组件的下拉刷新赋值， 不可删
    getUserInfo () {
      userInfoApi('', false).then(res => {
        this.updata_userInfo(res.data)
      })
    },
    creatWs () { // 开启websocket
      let company = location.href.split('/')[3]
      let websocketUrl = settings.websocketUrl
      ws.create(`${websocketUrl}/${company}`)
    }
  },
  created () {
    this.creatWs()
    // if (!this.userInfo) {
    //   this.getUserInfo()
    // }
  },
  mounted () {
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
    box-sizing: border-box;
  }
  #page {
    // position: relative;
    // min-height: 100vh;
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
.weui-toast.vux-toast-bottom {
  bottom: 70px;
}
.weui-dialog {
  border-radius: 6px;
}
@media screen and (min-width: 1024px) {
  .weui-dialog {
    width: 80%;
  }
}
.vux-confirm, .vux-alert {
  .weui-dialog__ft:after {
    display: none;
  }
  .weui-dialog__btn:after {
    top: 10px;
    transform: scale3d(0.5, 0.7, 1);
  }
  .weui-dialog__bd {
    font-weight: 300;
    font-size: 30px; /*px*/
    color: #666;
  }
  .weui-dialog__hd {
    .weui-dialog__title {
      color: #354048;
      font-size: 36px; /*px*/
      font-weight: 700;
    }
  }
  .weui-dialog__btn {
    font-size: 34px; /*px*/
  }
}
.weui-tabbar:before {
  border-color: #DCDCDC;
}
</style>
