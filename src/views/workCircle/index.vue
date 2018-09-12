<template>
  <div class="workCircle">
    <div class="header">
      <span class="attention" :class="{bottom : isFocus==='attention'}" @click="tab('attention')">关注</span>
      <span class="all" :class="{bottom : isFocus==='all'}" @click="tab('all')">全部</span>
    </div>
    <div class="classify">
      <span v-for="(item,index) in tabList" :key="index" :class="{ isFocusClassify:showBorder === item }" @click="cutoverTab(item)">{{item}}</span>
    </div>
    <div class="content">
      <info-card :showIntroduction="false"></info-card>
      <info-card :showIntroduction="false"></info-card>
      <info-card :showIntroduction="false"></info-card>
      <info-card :showIntroduction="false"></info-card>
      <info-card :showIntroduction="false"></info-card>
      <info-card :showIntroduction="false"></info-card>
      <info-card :showIntroduction="false"></info-card>
    </div>
  </div>
</template>

<script>
import infoCard from '@/components/infoCard/infoCard.vue'
export default {
  name: 'workCircle',
  components: {
    infoCard
  },
  data () {
    return {
      isFocus: 'attention',
      tabList: ['全部', '设计组', '技术组', '市场组', '运营组', '校园组', '人力资源组', '财务组'],
      showBorder: '全部'
    }
  },
  methods: {
    tab (name) {
      this.isFocus = name
    },
    init () {
      console.log(' 初始化方法 ')
    },
    cutoverTab (item) {
      this.showBorder = item
    }
  }
}
</script>

<style lang="less" scoped>
  .workCircle{
    padding-top: 178px;
    .header{
      position: fixed;
      top: 0;
      left: 0;
      background-color: #FFFFFF;
      box-shadow:0px 6px 10px 0px #F8F8F8;
      width: 100%;
      height: 98px;
      display: flex;
      justify-content: center;
      align-items: center;
      >span{
        line-height: 98px;
        width: 70px;
        text-align: center;
        color: #354048;
        font-size: 34px;/*px*/
        display: inline-block;
      }
      .attention{
        margin-right: 120px;
      }
      .bottom{
        position: relative;
        &::after{
          content: "";
          display: block;
          height: 6px;
          width: 50px;
          background: #FFE266;
          position: absolute;
          border-radius: 22px;
          left: 9px;
          bottom: 0;
        }
      }
    }
    /*分类栏*/
    .classify{
      background-color: #FFFFFF;
      line-height: 80px;
      white-space: nowrap;
      overflow-x: scroll;
      padding: 0 40px;
      height: 80px;
      position: fixed;
      top: 98px;
      left: 0;
      right: 0;
      z-index: 999;
      >span{
        font-weight: 300;
        display: inline-block;
        padding-right:46px;
        &:last-child{
          padding-right: 0;
        }
        &:focus{
          font-weight: 700;
        }
      }
      .isFocusClassify{
        font-weight: 500;
        position: relative;
        &::after{
          content: "";
          display: block;
          height: 6px;
          width: 30px;
          background: #FFE266;
          position: absolute;
          border-radius: 22px;
          left: 8px;
          bottom: 0;
        }
      }
    }
    /*tab列表*/
    .content{
    }
  }
</style>