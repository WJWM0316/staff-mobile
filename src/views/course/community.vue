<template>
  <div class="community">
    <!--头部-->
    <top-header :isCircle="false" :isJoin="true"></top-header>
    <div class="content">
      <div class="top">
        <div class="postNum">已更新<span style="color: #D7AB70;">10</span> 篇</div>
        <div class="rightBox" @click.stop="reverse">
          <div class="study">
            <img src="../../assets/icon/bnt_positioning@3x.png"/>上次学到
          </div>
          <div class="reverse">
            <img src="../../assets/icon/bnt_order@3x.png"/>倒序
          </div>
        </div>
      </div>
      <div class="lessonList">
        <div class="before">点击加载前面内容</div>
        <div class="Lesson">
          <span class="txt">1、如何快速获取第一批种子用户？-热身课程</span>
          <img src="../../assets/icon/icon_position@3x.png"/>
        </div>
        <div class="Lesson">
          <span class="txt">1、如何快速获取第一批种子用户？-热身课程</span>
          <img src="../../assets/icon/icon_position@3x.png"/>
        </div>
        <div class="Lesson">
          <span class="txt">1、如何快速获取第一批种子用户？-热身课程</span>
          <img src="../../assets/icon/icon_position@3x.png"/>
        </div>
        <div class="Lesson">
          <span class="txt">1、如何快速获取第一批种子用户？-热身课程</span>
          <img src="../../assets/icon/icon_position@3x.png"/>
        </div>
        <div class="Lesson">
          <span class="txt">1、如何快速获取第一批种子用户？-热身课程</span>
          <img src="../../assets/icon/icon_position@3x.png"/>
        </div>
        <div class="Lesson">
          <span class="txt">1、如何快速获取第一批种子用户？-热身课程</span>
          <img src="../../assets/icon/icon_position@3x.png"/>
        </div>
        <div class="after">点击加载后面内容</div>
      </div>
    </div>
  </div>
</template>

<script>
import topHeader from '@/components/courseHeader/courseHeader'
export default {
  name: 'community',
  components: {
    topHeader
  }
}
</script>

<style lang="less" scoped>
.community{
  .content{
    margin-top: 40px;
    /* 中间排序及引导栏 */
    .top{
      font-size: 28px;/*px*/
      width: 100%;
      height: 40px;
      background-color: #F9F9F9;
      box-sizing: border-box;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      >.postNum{
        font-weight: 300;
        color: #929292;
      }
      .rightBox{
        display: flex;
        .reverse, .study{
          color: #D7AB70;
          font-weight: 400;
          >img{
            width: 15px;
            height: 15px;
          }
        }
        .study{
          margin-right: 25px;
        }
      }
    }
    /* 课节列表 */
    .lessonList{
      box-sizing: border-box;
      padding: 0 20px;
      .Lesson{
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        .txt{
         white-space: nowrap;
         text-overflow: ellipsis;
         overflow: hidden;
         font-size: 30px;/*px*/
         font-weight: 400;
         margin-right: 15px;
         padding-top: 20.5px;
         padding-bottom: 15px;
         border-bottom: 1px solid #EDEDED;
        }
        >img{
          width: 21px;
          height: 21px;
        }
      }
      .before, .after{
        height: 56px;
        line-height: 56px;
        font-size: 28px;/*px*/
        font-weight: 300;
        color: #BCBCBC;
        text-align: center;
      }
    }
  }
}
</style>