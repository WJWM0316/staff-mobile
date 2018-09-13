<template>
  <div id="app-box" v-cloak>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" class="pullDown"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>

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
import { Tabbar, TabbarItem } from 'vux'
import { mapState } from 'vuex'
export default {
  components: {
    Tabbar,
    TabbarItem
  },
  computer: {
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
      ]
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
    }
  },
  created () {
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
      border-radius:6px;
      .icon {
        width: 30px;
        height: 30px;
        display: block;
        margin: 0 auto;
        animation: rotate 1s linear infinite;
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
