<template>
  <div class="backHome">
    <div class="home" v-if="type === '3' || type === '1'" @click.stop="toHome">
      <i class="homeIcon icon iconfont icon-btn_homepage"></i>
    </div>
    <div class="homeSearch" v-if="type === '2'">
      <span><i class="icon iconfont icon-btn_homepage" @click.stop="toHome"></i></span>|
      <span><i class="icon iconfont icon-bar_icon_search" @click.stop="toSearch"></i></span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: '1' // 1只有首页按钮 2首页+搜索
    }
  },
  methods: {
    toHome () {
      this.$router.push({path: '/home'})
    },
    toSearch () {
      this.$router.push({path: '/search', query: {id: this.$route.query.id}})
    }
  },
  created () {
  }
}
</script>
<style lang="less" scoped>
  .backHome {
    .home {
      position: absolute;
      top: 35px;
      right: 0;
      background: #fff;
      border-radius: 50px 0 0 50px;
      overflow: hidden;
      width: 45px;
      height: 32px;
      display: flex;
      padding: 0 12px 0 15px;
      box-sizing: border-box;
      align-items: center;
      box-shadow: 0px 1px 6px 0px rgba(0,0,0,0.12);
      .homeIcon {
        color: #354048;
        font-size: 30px;/*px*/
      }
    }
    .homeSearch{
      display: flex;
      flex-wrap: nowrap;
      z-index: 1000;
      position: absolute;
      right: 20px;
      top: 18px;
      width: 92px;
      height: 32px;
      color: #EDEDED;
      border-radius: 50px;
      box-shadow:0px 3px 12px 0px rgba(0,0,0,0.12);
      line-height: 32px;
      background-color: #FFFFFF;
      >span{
        display: inline-block;
        width: 45px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        >i{
          color: #354048;
          font-size: 30px;/*px*/
         }
      }
    }
  }
</style>