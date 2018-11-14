<template>
  <div class="workCircle">
    <div class="header">
      <span class="attention" :class="{bottom : isFocus==='attention'}" @click="tab('attention')">关注</span>
      <span class="all" :class="{bottom : isFocus==='all'}" @click="tab('all')">全部</span>
    </div>
    <div class="classify" v-if="!(total === 0 && isFocus === 'attention')">
      <span class="tabItem" v-for="(item,index) in tabList" :key="index" :class="{ isFocusClassify:showBorder === item.groupName }" @click="cutoverTab(item)">{{item.groupName}}</span>
    </div>
    <div class="content">
      <template v-for="(item, index) in circleList">
        <info-card type="2" :item="item" :isList="true" :showIntroduction="false" :origin="false" :key="index"></info-card>
      </template>
    </div>
    <pullUpUi :noData="all.noData" :pullUpStatus="all.pullUpStatus" @pullUp="pullUp"></pullUpUi>
    <nodata-box class="nodata" v-if="circleList.length === 0"></nodata-box>
  </div>
</template>

<script>
import infoCard from '@c/business/infoCard.vue'
import { getJobcircleApi, getAttentionsApi, getCircleClassfyApi } from '@/api/pages/workCircle'
import nodataBox from '@c/business/nodataBox'
export default {
  name: 'workCircle',
  components: {
    infoCard,
    scroll,
    nodataBox
  },
  data () {
    return {
      isFocus: 'attention',
      tabList: [],
      showBorder: '全部',
      circleList: [],
      param: {
        page: 1,
        count: 20,
        organization: 0
      },
      all: {
        list: [],
        page: 1,
        noData: false,
        pullUpStatus: false
      },
      isLastPage: false, // 是否最后一页
      total: 0 // 关注的工作圈数量
    }
  },
  methods: {
    async tab (name) {
      this.param.page = 1
      this.isFocus = name
      let res = {}
      if (name === 'all') {
        res = await this.getJobcircle()
      } else {
        res = await this.getAttentions()
      }
      this.total = res.meta.total
      res.meta.currentPage === res.meta.lastPage ? this.isLastPage = true : this.isLastPage = false
      this.circleList = res.data
    },
    /* 初始化方法 */
    async init () {
      let res = await this.getAttentions()
      this.total = res.meta.total
      let classfy = await getCircleClassfyApi()
      classfy.data.unshift({
        count: 10,
        groupId: 0,
        groupName: '全部',
        sort: 2
      })
      this.isFocus = 'attention'
      this.circleList = res.data
      res.meta.currentPage === res.meta.lastPage ? this.isLastPage = true : this.isLastPage = false
      this.tabList = classfy.data
    },
    /* 切换分类 */
    async cutoverTab (item) {
      this.param.page = 1
      this.showBorder = item.groupName
      this.param.organization = item.groupId
      let res = {}
      if (this.isFocus === 'all') {
        res = await this.getJobcircle(true)
      } else {
        res = await this.getAttentions(true)
      }
      res.meta.currentPage === res.meta.lastPage ? this.isLastPage = true : this.isLastPage = false
      this.circleList = res.data
    },
    /* 请求全部圈子列表 */
    getAttentions (needLoading) {
      return getAttentionsApi(this.param, needLoading)
    },
    /* 请求关注圈子列表 */
    getJobcircle (needLoading) {
      return getJobcircleApi(this.param, needLoading)
    },
    /* 滚动触发事件 */
    async pullUp () {
      if (this.isLastPage) {
        this.all.pullUpStatus = false
        this.all.noData = true
      } else {
        if (this.circleList.length <= 0) {
          return
        }
        this.all.pullUpStatus = true
        this.param.page += 1
        let res = {}
        if (this.isFocus === 'all') {
          res = await this.getJobcircle(false)
        } else {
          res = await this.getAttentions(false)
        }
        this.total = res.meta.total
        res.meta.currentPage === res.meta.lastPage ? this.isLastPage = true : this.isLastPage = false
        this.circleList.push(...res.data)
        this.all.pullUpStatus = false
      }
    }
  },
  created () {
    this.init()
  }
}
</script>

<style lang="less" scoped>
  .workCircle{
    /*padding-bottom: 49px;*/
    padding-top: 89px;
    .header{
      position: fixed;
      top: 0;
      left: 0;
      background-color: #FFFFFF;
      box-shadow:0px 3px 5px 0px rgba(248,248,248,1);
      width: 100%;
      height: 49px;
      display: flex;
      justify-content: center;
      flex-wrap: nowrap;
      z-index: 999;
      align-items: center;
      .all, .attention{
        line-height: 49px;
        display: inline-block;
        width: 35px;
        text-align: center;
        color: #BCBCBC;
        font-size: 34px;/*px*/
        white-space: nowrap;
      }
      .attention{
        margin-right: 60px;
      }
      .bottom{
        font-weight: 700;
        color: #354048;
        position: relative;
        &::after{
          content: "";
          display: block;
          height: 3px;
          width: 25px;
          background: #FFE266;
          position: absolute;
          border-radius: 11px;
          left: 4.5px;
          bottom: 0;
        }
      }
    }
    /*分类栏*/
    .classify{
      background-color: #FFFFFF;
      line-height: 40px;
      white-space: nowrap;
      overflow-y: hidden;
      overflow-x: scroll;
      padding: 0 20px;
      height: 40px;
      position: fixed;
      top: 49px;
      left: 0;
      right: 0;
      z-index: 99;
      >span{
        font-weight: 300;
        display: inline-block;
        margin-right:23px;
        &:last-child{
          margin-right: 0;
        }
        &:focus{
          font-weight: 700;
        }
      }
      .tabItem{
        font-size: 26px;/*px*/
        color: #929292;
      }
      .isFocusClassify{
        font-weight: 700;
        position: relative;
        color: #354048;
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
    /*tab列表*/
    .content{
    }
    .nodata{
      margin-top: 0;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  }
</style>