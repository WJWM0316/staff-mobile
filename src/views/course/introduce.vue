<template>
  <div class="introduce">
    <top-header :pageInfo="pageInfo" :isCircle="false" :isJoin="false"></top-header>
    <div class="richText">
      <div class="title">关于文本</div>
      <div class="content" v-html="pageInfo.intro"></div>
    </div>
    <div class="bottomBtn" v-if="!isCourseIntroduce && !pageInfo.isMaster && pageInfo.userRole.isJoin === 0">
      <div class="join" @click.stop="joinCourse" v-if="pageInfo.status === '上线'">立即学习</div>
      <div class="end" v-else>课程已下线，无法加入学习</div>
    </div>
  </div>
</template>

<script>
import topHeader from '@/components/business/commonHeader'
import { courseInfoApi, getCourseJoinApi } from '@/api/pages/course'
export default {
  name: 'courseIntroduce',
  components: {
    topHeader
  },
  data () {
    return {
      isEnd: false,
      isCourseIntroduce: false, // 是否介绍页
      pageInfo: {
        userRole: {}
      }
    }
  },
  methods: {
    /* 加入课程 */
    joinCourse () {
      console.log(' 加入课程 ')
      getCourseJoinApi({id: this.$route.query.id}).then(() => {
        this.$router.push({path: '/course/community', query: {id: this.pageInfo.id}})
      }).catch(res => {
        console.log(res)
      })
    },
    /* 初始化方法 */
    async init (id) {
      let res = await this.getcourseDetail(id)
      this.pageInfo = res.data
    },
    /* 课程详情接口 */
    getcourseDetail (id) {
      return courseInfoApi(id)
    }
  },
  async created () {
    const { id, isCourseIntroduce } = this.$route.query
    this.isCourseIntroduce = isCourseIntroduce || false
    await this.init({id: id})
    if (!this.$route.query.isCourseIntroduce && (this.pageInfo.userRole.isJoin === 1 || this.pageInfo.isMaster)) {
      this.$router.push({path: '/course/community', query: {id: this.pageInfo.id}})
    }
  }
}
</script>

<style lang="less" scoped>
  .introduce{
    height: 100vh;
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