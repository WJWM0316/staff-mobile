<template>
  <div class="postDetail">
    <div class="header">
      <contentheader :showCommunicate="false" :showBorder="false"></contentheader>
    </div>
    <div class="container">
      <div class="fixed-box" ref="ceiling-box">
        <div class="ceiling-box" :class="navTabName">
          <span @click="toggle('comment')">评论(10)</span>
          <span @click="toggle('praise')">点赞(12)</span>
        </div>
      </div>
      <!--评论-->
      <template v-if="navTabName === 'comment'">
        <div>
          <!-- 热门评论 -->
          <div class="hot-area" v-if="true">
            <i class="hot-icon"><img src="../../assets/icon/icon_hotcomment@3x.png" alt=""></i><span>热门评论</span>
          </div>
          <!-- 全部评论 -->
          <div class="hot-area" v-if="false">
            <i class="hot-icon"><img src="../../assets/icon/tab-massage-3@3x.png" alt=""></i><span>全部评论</span>
          </div>
        </div>
        <div v-if="true">
          <discuss-item></discuss-item>
          <discuss-item></discuss-item>
          <discuss-item :isShowBorder="false"></discuss-item>
          <p class="community-empty-desc">成为第一个评论的人吧~</p>
        </div>
      </template>
      <!-- 点赞 -->
      <template v-else>
        <div class="content-praise">
          <classmate-item :showMangerTitle="true"></classmate-item>
          <classmate-item :showMangerTitle="false"></classmate-item>
          <classmate-item :showMangerTitle="false"></classmate-item>
          <div v-if="true">
            <p class="community-empty-desc">成为第一个点赞的人吧~</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import classmateItem from '@c/business/classmateItem'
import contentheader from '@c/business/dynamicItem'
import discussItem from '@c/business/discussItem'
export default {
  name: 'detail',
  components: {
    contentheader,
    classmateItem,
    discussItem
  },
  data () {
    return {
      navTabName: 'comment'
    }
  },
  methods: {
    /* 切换nav  */
    toggle (targetName) {
      if (this.navTabName !== targetName) {
        this.navTabName = targetName
      }
    }
  }
}
</script>
<style lang="less" scoped>
.postDetail{
  .container{
    padding: 0 40px;
    .ceiling-box {
      display: flex;
      align-items: center;
      color: #354048;
      font-size: 30px;/*px*/
      border-bottom: solid 1px #DCDCDC; /* no */
      span {
        font-weight: 500;
        line-height: 42px;
        margin-right: 63px;
        padding: 35px 0 16px;
      }
      &.comment span:nth-of-type(1),
      &.praise span:nth-of-type(2) {
        color: #354048;
        font-weight: 700;
        position: relative;
      }
      &.comment span:nth-of-type(1):after,
      &.praise span:nth-of-type(2):after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 4px;
        border-radius: 4px;
        background-color: #FFE266;
      }
    }
    /* 评论标签样式 */
   .hot-area {
      display: flex;
      align-items: center;
      height: 80px;
      font-size: 30px;/*px*/
      font-weight: 300;
      color: #354048;
      background: #F8F8F8;
      border-top: solid 1px #DCDCDC; /* no */
      padding: 0 40px;
      margin-left: -40px;
      margin-right: -40px;
      .hot-icon {
        display: inline-block;
        margin-right: 20px;
        img {
          margin-top: -5px;
          width: 40px;
          height: 40px;
        }
      }
    }
    /* 点赞栏样式    */
    .content-praise{
      margin: 0 -40px;
      padding: 0 40px;
      border-top: solid 1px #DCDCDC;
    }
    /* 评论及点赞无数据时提示内容样式    */
    .community-empty-desc {
      margin-top: 50px;
      color: #bcbcbc;
      text-align: center;
      margin-bottom: 30px;
    }
  }
}
</style>