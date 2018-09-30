<template>
	<div class="coursePage">
	  <div class="classify">
      <span v-for="(item,index) in tabList" :key="index" :class="{ isFocusClassify:showBorder === item }" @click="cutoverTab(item)">{{item.categoryName}}</span>
    </div>
    <div class="content">
      <template v-for="(item, index) in circleList">
        <info-card :item="item" :showIntroduction="false" :origin="true" :key="index"></info-card>
      </template>
    </div>
	</div>
</template>

<script>
import { courseListApi, categoryApi } from '@/api/pages/course'
import infoCard from '@c/business/infoCard.vue'
export default {
  components: {
    infoCard
  },
  data () {
    return {
      data: 1,
      tabList: [],
      showBorder: '全部',
      circleList: []
    }
  },
  created () {
    this.pageInt()
  },
  methods: {
    //  初始化方法
    async pageInt () {
      let classfy = await this.getCategory()
      let res = await this.getCourseList()
      this.circleList = res.data
      this.tabList = classfy.data
    },
    cutoverTab (item) {
      this.showBorder = item
    },
    // 请求列表接口
    getCourseList () {
      return courseListApi({count: 20})
    },
    // 请求分类列表
    getCategory () {
      return categoryApi()
    }
  }
}
</script>

<style lang="less" scoped>
.coursePage{
  padding-top: 40px;
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
      color: #929292;
      font-weight: 300;
      display: inline-block;
      margin-right:23px;
      &:last-child{
        margin-right: 0;
      }
    }
    .isFocusClassify{
      color: #354048;
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