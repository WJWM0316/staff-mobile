<template>
  <div class="wrap" v-if="pageInfo">
    <top-header :pageInfo="pageInfo" type='1' @toCourseIntroduce="toCourseIntroduce" @toCourseDetail="toCourseDetail"></top-header>
    <div class="introduce" v-if="(!pageInfo.isJoin && !pageInfo.isMaster) || isCourseIntroduce">
      <div class="richText">
        <div class="title">关于课程</div>
        <div class="content" v-html="removeFontSize(pageInfo.intro)"></div>
      </div>
      <div class="bottomBtn" v-if="!isCourseIntroduce && !pageInfo.isMaster && pageInfo.isJoin === 0">
        <div class="join" @click.stop="joinCourse" v-if="pageInfo.status === '上线'">立即学习</div>
        <div class="end" v-else>课程已下线，无法加入学习</div>
      </div>
    </div>
    <div class="community" v-else>
      <div class="content">
        <div class="top">
          <div class="postNum">已更新<span style="color: #D7AB70;">{{lessonTotal}}</span> 篇</div>
          <div class="rightBox">
            <div class="study" v-if="false">
              <img src="../../assets/icon/bnt_positioning@3x.png"/>上次学到
            </div>
            <div class="reverse" @click.stop="reverse('asc')" v-if="!isReverse">
              <img src="../../assets/icon/bnt_order@3x.png"/>正序
            </div>
            <div class="reverse" @click.stop="reverse('DESC')" v-else>
              <img src="../../assets/icon/bnt_order@3x.png"/>倒序
            </div>
          </div>
        </div>
        <div class="lessonList">
          <div class="before" v-if="false">点击加载前面内容</div>
          <div v-for="(item, index) in lessonList" class="Lesson" :key="index" @click.stop="toLesson(item)">
            <span class="txt">{{item.showId}}、{{item.title}}</span>
            <!--正在学习-->
            <img v-show="item.statusInfo.isCurrentStudy === 1" src="@/assets/icon/icon_position@3x.png"/>
            <!--未解锁-->
            <img v-show="item.statusInfo.isUnlock === 0" src="@/assets/icon/icon_lock@3x.png"/>
            <!--已解锁-->
            <img v-show="item.statusInfo.isUnlock === 1 && item.statusInfo.isCurrentStudy === 0 && item.statusInfo.isPunchCard === 0" src="@/assets/icon/icon_unlock@3x.png"/>
            <!--已完成-->
            <img v-show="item.statusInfo.isPunchCard === 1 && item.statusInfo.isCurrentStudy !== 1" src="@/assets/icon/icon_complete@3x.png"/>
          </div>
          <div class="after" v-if="lessonTotal > lessonList.length" @click.stop="loadMoreLesson">点击加载后面内容</div>
          <div class="after" v-else>没有更多内容了~</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import topHeader from '@/components/business/commonHeader'
import { courseInfoApi, getCourseJoinApi, CourseSectionApi } from '@/api/pages/course'
export default {
  name: 'courseDetail',
  components: {
    topHeader
  },
  data () {
    return {
      isEnd: false,
      isCourseIntroduce: false, // 是否介绍页
      pageInfo: null,
      jsonData: { // 获取课节列表的筛选条件参数
        order: {
          sort: 'asc'
        },
        sort: 0,
        course_id: 1
      },
      listPage: 1,
      lessonList: [],
      lessonTotal: '', // 课节数量
      isReverse: true // 是否倒序：true正序，false：倒序
    }
  },
  methods: {
    joinCourse () {
      getCourseJoinApi({id: this.$route.query.id}).then(() => {
        this.init()
        this.$alert({title: '欢迎加入课程', content: '本课程已添加到首页-正在学习列表，开始学习吧～'})
      })
    },
    toLesson (item) {
      if (item.statusInfo.isUnlock === 0) {
        this.$toast({text: '请先解锁前面课节'})
        return
      }
      this.$router.push(`/courseLesson?id=${item.courseSectionId}`)
    },
    async init () {
      const { id } = this.$route.query
      let res = await this.getcourseDetail({id: id})
      let lessonList = await this.getCourseSectionApi()
      this.lessonList = lessonList.data
      this.lessonTotal = lessonList.meta.total
      this.pageInfo = res.data
    },
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
    },
    async reverse (e) {
      this.jsonData.order.sort = e
      let lessonList = await this.getCourseSectionApi()
      this.lessonList = lessonList.data
      this.isReverse = !this.isReverse
    },
    async loadMoreLesson () {
      this.listPage += 1
      let lessonList = await this.getCourseSectionApi()
      this.lessonList.push(...lessonList.data)
    },
    getcourseDetail (id) {
      return courseInfoApi(id)
    },
    /* 切换课程介绍 */
    async toCourseIntroduce () {
      const { isCourseIntroduce } = this.$route.query
      this.isCourseIntroduce = isCourseIntroduce || false
      await this.init()
    },
    async toCourseDetail () {
      this.isCourseIntroduce = false
      await this.init()
    }
  },
  async created () {
    const { isCourseIntroduce } = this.$route.query
    this.isCourseIntroduce = isCourseIntroduce || false
    await this.init()
  }
}
</script>

<style lang="less" scoped>
.introduce{
  padding-bottom: 49px;
  height: 51vh;
  .richText{
    padding-bottom: 50px;
    margin-top: 50px;
    .title{
      position: relative;
      margin: 0 20px;
      padding-left: 15px;
      box-sizing: border-box;
      color: #929292;
      line-height: 24px;
      font-size: 40px;/*px*/
      font-weight: 700;
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
      padding-bottom: 15px;
      font-size: 30px; /*px*/
      line-height: 1.4;
      font-weight: 300;
      color: #354048;
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
          font-weight: 300;
          >img{
            width: 15px;
            height: 15px;
          }
        }
        .reverse{
          display: flex;
          align-items: center;
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
         font-weight: 300;
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