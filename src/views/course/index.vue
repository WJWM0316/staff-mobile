<template>
	<div class="coursePage">
	  <div class="classify">
      <span v-for="(item,index) in tabList" :key="index" :class="{ isFocusClassify:showBorder === item }" @click="cutoverTab(item)">{{item}}</span>
    </div>
    <div class="content">
      <template v-for="(item, index) in circleList">
        <info-card :item="item" :showIntroduction="false" :origin="false" :key="index"></info-card>
      </template>
    </div>
	  <!--<info-card></info-card>
	  <info-card></info-card>
	  <info-card></info-card>
	  <info-card></info-card>-->
	</div>
</template>

<style lang="less" scoped>
.coursePage{
  padding-top: 40px;
  /*分类栏*/
  .classify{
    font-size: 28px;/*px*/
    background-color: #FFFFFF;
    line-height: 40px;
    white-space: nowrap;
    overflow-x: scroll;
    padding: 0 20px;
    height: 40px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 999;
    >span{
      font-weight: 300;
      display: inline-block;
      margin-right:23px;
      &:last-child{
        margin-right: 0;
      }
    }
    .isFocusClassify{
      font-weight: 500;
      position: relative;
      &::after{
        content: "";
        display: block;
        height: 3px;
        width: 15px;
        background: #FFE266;
        position: absolute;
        border-radius: 11px;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
      }
    }
  }
}
</style>

<script>
import infoCard from '@/components/infoCard/infoCard.vue'
export default {
  name: 'course',
  components: {
    infoCard
  },
  data () {
    return {
      data: 1,
      tabList: ['全部', '设计组', '技术组', '市场组', '运营组', '校园组', '人力资源组', '财务组'],
      showBorder: '全部',
      circleList: []
    }
  },
  created () {
    this.pageInt()
  },
  methods: {
    //  初始化方法
    async pageInt () {},
    cutoverTab (item) {
      this.showBorder = item
    }
  }
}
</script>
