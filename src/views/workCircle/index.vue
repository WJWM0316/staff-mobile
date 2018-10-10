<template>
  <div class="workCircle">
    <div class="header">
      <span class="attention" :class="{bottom : isFocus==='attention'}" @click="tab('attention')">关注</span>
      <span class="all" :class="{bottom : isFocus==='all'}" @click="tab('all')">全部</span>
    </div>
    <div class="classify">
      <span v-for="(item,index) in tabList" :key="index" :class="{ isFocusClassify:showBorder === item.groupName }" @click="cutoverTab(item)">{{item.groupName}}</span>
    </div>
    <div class="content">
      <template v-for="(item, index) in circleList">
        <info-card type="2" :item="item" :showIntroduction="false" :origin="false" :key="index"></info-card>
      </template>
    </div>
  </div>
</template>

<script>
import infoCard from '@c/business/infoCard.vue'
import { getJobcircleApi, getAttentionsApi, getCircleClassfyApi } from '@/api/pages/workCircle'
export default {
  name: 'workCircle',
  components: {
    infoCard,
    scroll
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
      }
    }
  },
  methods: {
    async tab (name) {
      this.isFocus = name
      let res = {}
      if (name === 'all') {
        res = await this.getJobcircle()
      } else {
        res = await this.getAttentions()
      }
      this.circleList = res.data
    },
    /* 初始化方法 */
    async init () {
      let res = await this.getAttentions()
      let classfy = await getCircleClassfyApi()
      classfy.data.unshift({
        count: 10,
        groupId: 0,
        groupName: '全部',
        sort: 2
      })
      this.isFocus = 'attention'
      this.circleList = res.data
      this.tabList = classfy.data
    },
    /* 切换分类 */
    async cutoverTab (item) {
      this.showBorder = item.groupName
      this.param.organization = item.groupId
      let res
      if (this.isFocus === 'all') {
        res = await this.getJobcircle()
      } else {
        res = await this.getAttentions()
      }
      this.circleList = res.data
    },
    /* 请求全部圈子列表 */
    getAttentions () {
      return getAttentionsApi(this.param)
    },
    /* 请求关注圈子列表 */
    getJobcircle () {
      return getJobcircleApi(this.param)
    }
  },
  created () {
    this.init()
  }
}
</script>

<style lang="less" scoped>
  .workCircle{
    padding-bottom: 49px;
    padding-top: 89px;
    .header{
      position: fixed;
      top: 0;
      left: 0;
      background-color: #FFFFFF;
      box-shadow:0px 3px 5px 0px #F8F8F8;
      width: 100%;
      height: 49px;
      display: flex;
      justify-content: center;
      z-index: 99;
      align-items: center;
      >span{
        line-height: 49px;
        width: 35px;
        text-align: center;
        color: #354048;
        font-size: 34px;/*px*/
        display: inline-block;
      }
      .attention{
        margin-right: 60px;
      }
      .bottom{
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
      overflow-x: scroll;
      padding: 0 20px;
      height: 40px;
      position: fixed;
      top: 49px;
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
  }
</style>