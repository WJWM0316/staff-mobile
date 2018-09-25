<template>
  <div class="community">
    <!--头部-->
    <top-header :pageInfo="pageInfo" :isCircle="false" :isJoin="true"></top-header>
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
        <div v-for="(item, index) in lessonList" class="Lesson" :key="index" @click.stop="toLesson(item.courseSectionId)">
          <span class="txt">{{index+1}}、{{item.title}}</span>
          <!--正在学习-->
          <img v-show="item.statusInfo.isCurrentStudy === 1" src="@/assets/icon/icon_position@3x.png"/>
          <!--未解锁-->
          <img v-show="item.statusInfo.isUnlock === 1" src="@/assets/icon/icon_lock@3x.png"/>
          <!--已解锁-->
          <img v-show="item.statusInfo.isUnlock === 0 && item.statusInfo.isCurrentStudy === 0 && item.statusInfo.isPunchCard === 0" src="@/assets/icon/icon_unlock@3x.png"/>
          <!--已完成-->
          <img v-show="item.statusInfo.isPunchCard === 1 && item.statusInfo.isCurrentStudy !== 1" src="@/assets/icon/icon_complete@3x.png"/>
        </div>
        <div class="after">点击加载后面内容</div>
      </div>
    </div>
  </div>
</template>

<script>
import topHeader from '@/components/courseHeader/courseHeader'
import { courseInfoApi, CourseSectionApi } from '@/api/pages/course'
export default {
  name: 'community',
  components: {
    topHeader
  },
  data () {
    return {
      pageInfo: {},
      jsonData: { // 获取课节列表的筛选条件参数
        order: {
          update_time: 'DESC',
          favors_count: 'DESC',
          comments_count: 'DESC'
        },
        course_id: 1
      },
      listPage: 1,
      lessonList: []
    }
  },
  methods: {
    toLesson (id) {
      this.$router.push({path: '/course/lesson', query: {id: id}})
    },
    /* 初始化方法 */
    async init (id) {
      let res = await this.getcourseDetail(id)
      let lessonList = await this.getCourseSectionApi()
      this.lessonList = lessonList.data
      this.pageInfo = res.data
    },
    /* 课程详情接口 */
    getcourseDetail (id) {
      return courseInfoApi(id)
    },
    /* 获取课节列表 */
    getCourseSectionApi () {
      this.jsonData.course_id = this.$route.query.id
      let jsonDataString = JSON.stringify({search: this.jsonData})
      let UrlString = encodeURIComponent(jsonDataString)
      let param = {
        jsonData: UrlString,
        page: this.listPage,
        pageCount: 20
      }
      return CourseSectionApi(param)
    }
  },
  created () {
    const { id } = this.$route.query
    this.init({id: id})
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
          width: 100%;
         white-space: nowrap;
         text-overflow: ellipsis;
         overflow: hidden;
         font-size: 30px;/*px*/
         font-weight: 400;
         margin-right: 15px;
         padding-top: 20.5px;
         padding-bottom: 15px;
         border-bottom: 1px solid #EDEDED;/*px*/
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
