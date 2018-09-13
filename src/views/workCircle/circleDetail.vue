<template>
  <div class="circleDetail">
    <circle-header></circle-header>
    <!-- 发帖   -->
    <div class="postBox">
      <div class="postInfo">
        <img class="postImg" src="../../assets/icon/icon_writing.png"/>
        <p class="post">发帖</p>
      </div>
    </div>
  </div>
</template>

<script>
import circleHeader from '@/components/courseHeader/courseHeader'
export default {
  name: 'circleDetail',
  components: {
    circleHeader
  }
}
</script>

<style lang="less" scoped>
.circleDetail{
  /*发帖悬浮窗样式*/
  .postBox{
    position: fixed;
    bottom: 50px;
    right: 40px;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    box-shadow: 0px 24px 24px 5px rgba(0,0,0,0.08);
    .postInfo{
      display: flex;
      align-content: center;
      justify-content: center;
      flex-wrap: wrap;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #FFFFFF;
      box-shadow: 0px -1px 1px 1px rgba(0,0,0,0.08) inset;
      >.postImg{
        display: block;
        margin: 0 auto;
        width: 44px;
        height: 46px;
      }
      >.post{
        margin-top: 10px;
        font-size: 22;
        font-weight: 400;
        color: #D7AB70;
        text-align: center;
        width: 100%;
      }
    }
  }
}
</style>