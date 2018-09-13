<template>
  <div class="introduce">
    <top-header :isCircle="false" :isJoin="false"></top-header>
    <div class="richText">
      <div class="title">关于文本</div>
      <div class="content">这里是富文本</div>
    </div>
    <div class="bottomBtn" v-show="!isCourseIntroduce">
      <div class="join" @click.stop="joinCourse" v-if="!isEnd">立即学习</div>
      <div class="end" v-else>课程已下线，无法加入学习</div>
    </div>
  </div>
</template>

<script>
import topHeader from '@/components/courseHeader/courseHeader'
export default {
  name: 'courseIntroduce',
  components: {
    topHeader
  },
  data () {
    return {
      isEnd: false,
      isCourseIntroduce: false
    }
  },
  methods: {
    /* 加入课程 */
    joinCourse () {
      console.log(' 加入课程 ')
      this.$router.push('/course/community')
    }
  }
}
</script>

<style lang="less" scoped>
  .introduce{
    .richText{
      margin-top: 50px;
      .title{
        position: relative;
        margin: 0 20px;
        padding-left: 15px;
        box-sizing: border-box;
        color: #929292;
        line-height: 24px;
        font-size: 40px;/*px*/
        font-weight: 500;
        &::before{
          content: '';
          display: block;
          width: 6px;
          height: 20px;
          background-color: #FFE266;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .content{
        padding: 15px 20px;
      }
    }
    .bottomBtn{
      width: 100%;
      height: 49px;
      position: fixed;
      bottom: 0;
      left: 0;
      background: red;
      .join, .end{
        height: 100%;
        line-height: 49px;
        text-align: center;
      }
      .join{
        background-color: #FFE266;
        color: #354048;
      }
      .end{
        background-color: #F8F8F8;
        color: #929292;
      }
    }
  }
</style>