<template>
	<div class="coursePage">
	  <div class="classify">
      <span v-for="(item,index) in tabList" :key="index" :class="{ isFocusClassify:showBorder === item.categoryName }" @click="cutoverTab(item)">{{item.categoryName}}</span>
    </div>
    <div class="content">
      <template v-for="(item, index) in circleList">
        <info-card :item="item" :needProgress="false" :key="index"></info-card>
      </template>
    </div>
    <pullUpUi :noData="all.noData" :pullUpStatus="all.pullUpStatus" @pullUp="pullUp"></pullUpUi>
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
      tabList: [],
      showBorder: '全部',
      circleList: [],
      classfy: 0, // 0:默认全部
      all: {
        list: [],
        page: 1,
        noData: false,
        pullUpStatus: false
      },
      isLastPage: false
    }
  },
  created () {
    this.pageInt()
  },
  methods: {
    // 初始化方法
    async pageInt () {
      let classfy = await this.getCategory()
      let res = await this.getCourseList()
      classfy.data.unshift({
        categoryId: 0,
        categoryName: '全部',
        sort: 1
      })
      this.circleList = res.data
      this.tabList = classfy.data
      res.meta.currentPage === res.meta.lastPage ? this.isLastPage = true : this.isLastPage = false
    },
    // 切换分类
    async cutoverTab (item) {
      this.classfy = item.categoryId
      let res = await this.getCourseList(true)
      res.meta.currentPage === res.meta.lastPage ? this.isLastPage = true : this.isLastPage = false
      this.circleList = res.data
      this.showBorder = item.categoryName
    },
    // 请求列表接口
    getCourseList (needLoading) {
      let param = {
        page: this.all.page,
        count: 20,
        category: this.classfy
      }
      return courseListApi(param, needLoading)
    },
    getCategory () {
      return categoryApi()
    },
    /* 滚动触发事件 */
    async pullUp () {
      if (this.isLastPage) {
        console.log(' 111111 ')
        this.all.pullUpStatus = false
        this.all.noData = true
      } else {
        if (this.circleList.length <= 0) {
          return
        }
        this.all.pullUpStatus = true
        this.all.page += 1
        let res = await this.getCourseList(false)
        res.meta.currentPage === res.meta.lastPage ? this.isLastPage = true : this.isLastPage = false
        this.circleList.push(...res.data)
        this.all.pullUpStatus = false
      }
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
    .content{
      height: 100%;
    }
  }
}
</style>