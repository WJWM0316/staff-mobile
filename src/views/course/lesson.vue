<template>
  <!--课节页面-->
  <div class="lesson" v-if="communityCourse">
    <!--头部图片标题区-->
    <div class="lesson-header">
      <div class="header-title">
        {{communityCourse.title}}
      </div>
      <div class="header-info">
        <div class="left"><img v-if="communityCourse.tutorUser.avatarInfo" :src="communityCourse.tutorUser.avatarInfo.smallUrl"/><span class="mast-name">{{communityCourse.tutorUser.realname | ellipsis(12)}}</span><span class="mast-time">{{communityCourse.createTime}}</span></div>
        <span class="backCourse" @click.stop="backCourse">课程主页</span>
      </div>
    </div>
    <!--富文本区-->
    <div class="lesson-module">
      <!--视频-->
      <div class="lesson-video" v-if="communityCourse.av && communityCourse.av.attachType==='video'" @click.stop="playVideo">
        <div class="videoBOx" v-if="videoPlay"><i class="icon iconfont icon-play_vidio"></i></div>
        <video :poster="communityCourse.av.coverImg.url" controls ref="video">
          <source :src="communityCourse.av.url" type="video/mp4">
             您的浏览器不支持 HTML5 video 标签，请升级浏览器或者更换浏览器。
        </video>
      </div>
      <!-- 音频 -->
      <div class="audioBox" v-if="communityCourse.av && communityCourse.av.attachType==='audio'">
        <audio-item :messageData="audioList" :isLesson="true"></audio-item>
      </div>
      <div class="module-content h5-code" v-html="communityCourse.details" ref="H5">
      </div>
    </div>

    <!-- 已加入 -->
    <template>
        <!--本节任务-->
        <div class="lesson-task" v-if="communityCourse.punchCardTitle || (communityCourse.punchCardCImgInfo && communityCourse.punchCardCImgInfo.length>0)">
          <!--头部标题-->
          <div class="headerBox">
            <div class="title-pic1">
              <span class="txt">本节打卡任务</span>
            </div>
            <div class="title-pic2"></div>
          </div>
          <!--头部标题-->
          <div class="content-txt" v-html="communityCourse.punchCardTitle">
          </div>
          <div class="content-img">
            <div class="content-images" v-if="communityCourse.punchCardCImgInfo">
              <!-- 图片为 1 张时 -->
              <div class="item-image one" v-if="communityCourse.punchCardCImgInfo && communityCourse.punchCardCImgInfo.length === 1">
                <img :src="communityCourse.punchCardCImgInfo[0].url" v-preview="true" :data-src="communityCourse.punchCardCImgInfo[0].url" />
              </div>
              <!--  图片为 多 张时  -->
              <div class="item-image" v-for="(file, index) in communityCourse.punchCardCImgInfo" :key="index" v-else>
                <img :src="file.url" v-preview="true" :data-src="file.url" />
              </div>
            </div>
          </div>
        </div>
        <!--本节任务结束-->
        <!--优秀打卡区-->
        <div class="lesson-punch">
          <!--头部标题-->
          <div class="headerBox">
            <div class="title-pic1">
              <span class="txt">打卡区</span>
            </div>
            <div class="title-pic2"></div>
          </div>
          <div class="no-punch" v-if="peopleCourseCardListCount === 0">
            还没人打卡哦，赶紧点击下方“去打卡”， 成为本节第一个打卡的人吧～
          </div>
          <!--优秀头部标题图片-->
          <div class="excellentPunchList"  v-if="excellentPunchList.length > 0">
            <div class="excellent-punch">
              <div class="excellent-punch-title">优秀打卡</div>
            </div>
            <div class="hr"></div>
            <!--优秀打卡内容区-->
            <lessondynamicItem
               v-for="(item, index) in excellentPunchList"
               :key = "index"
               :item="item"
               @setPostTop="setPostTop"
            ></lessondynamicItem>
            <div class="expand-btn" @click.stop="toPunchList('excellent')" v-if="excellentPeopleCourseCardListCount>5">
              <div>
                查看所有优秀打卡 <span>({{excellentPeopleCourseCardListCount}})</span>
              </div>
            </div>
          </div>
        </div>
        <!--所有打卡区-->
        <div class="all-punch" v-if="peopleCourseCardListCount !== 0">
          <div class="excellent-punch">
            <div class="excellent-punch-title">所有打卡</div>
          </div>
          <div class="hr"></div>
          <lessondynamicItem
             v-for="(item, index) in peopleCourseCardList"
             :key = "index"
             :item="item"
             @setPostTop="setPostTop"
          ></lessondynamicItem>
          <div class="expand-btn all-show" @click.stop="toPunchList('all')" v-if="peopleCourseCardListCount > 5">
            <div>
              查看所有打卡 <span>({{peopleCourseCardListCount}})</span>
            </div>
          </div>
        </div>
        <!--底部打卡按钮区-->
        <div v-if="communityCourse.isTutor !== 1">
          <div class="lesson-footer" v-if="communityCourse.statusInfo.isPunchCard === 0">
            <div class="toPunch" @click.stop="toPunch">
              打卡做任务，解锁下一节课
            </div>
          </div>
          <div class="lesson-footer" v-else>
            <div class="mine" @click.stop="toMindDetail(communityCourse.peopleId,communityCourse.id)">我的打卡</div>
          </div>
        </div>
    </template>
    <actionsheet v-model="addActionsConfig.show" :menus="nowChoosePunch.isExcellentCard === 1?addActionsConfig.menus2:addActionsConfig.menus" show-cancel @on-click-menu="handleAddActoinItem" />
  </div>
</template>
<script>
import lessondynamicItem from '@c/business/dynamicItem'
import { Actionsheet } from 'vux'
import { getCourseCardListApi, setExcellentCourseCardApi, lessonDetailApi } from '@/api/pages/course'
import audioItem from '@c/functional/audio'
export default {
  components: {
    lessondynamicItem,
    Actionsheet,
    audioItem
  },
  data () {
    return {
      video: '', // 视频
      videoPlay: true, // 视频是否在播放
      showIdentification: true,
      disableOperationArr: ['comment'],
      isPlayList: false,
      // 所有打卡数据
      peopleCourseCardList: '',
      peopleCourseCardListCount: '',
      excellentPunchList: '',
      excellentPeopleCourseCardListCount: '',
      // 是否试读
      trialReading: 0, // 0是非试读， 1是试读
      // 最新课节信息
      communityCourse: '',
      communityId: '',
      isPunch: 0, // 是否已经打卡0:是未打卡，1是打卡
      curPeopleInfo: '',
      countCardInfo: '',
      isExcellentCard: 0, // 是否优秀打卡，0：不是，1是优秀
      optPunch: '', // 当前要评选的打卡信息
      // 选为优秀打卡或取消优秀打卡
      addActionsConfig: {
        show: false,
        menus: [{
          label: ' 选为优秀打卡 ',
          value: ' selected '
        }],
        menus2: [{
          label: ' 取消优秀打卡 ',
          value: ' disSelect '
        }]
      },
      lessonData: {},
      jsonData: { // 获取课节详情的筛选条件参数
        course_section_id: 1,
        order: {
          punch_card_time: 'desc'
        }
      },
      listPage: 1, // 当前打卡列表的页数
      messageData: {}, // 音频数据
      nowChoosePunch: '' // 当前选择的要评选或取消评选优秀打卡的打卡
    }
  },
  computed: {
    // 是否已入社
    isJoinAgency () {
      return this.lessonData.isAuthor || this.lessonData.isJoined
    }
  },
  methods: {
    /* 初始化方法 */
    async init () {
      const { id } = this.$route.query
      let res = await this.getlessonData(id)
      let cardList = await this.getCourseCardListApi(id)
      this.communityCourse = res.data
      if (res.data.av && res.data.av.attachType === 'audio') {
        this.audioList = res.data.av
      }
      this.peopleCourseCardList = cardList.data.peopleCourseCardList
      this.excellentPunchList = cardList.data.excellentPeopleCourseCardList
      this.peopleCourseCardListCount = cardList.data.peopleCourseCardListCount
      this.excellentPeopleCourseCardListCount = cardList.data.excellentPeopleCourseCardListCount
    },
    /* 获取课节详情 */
    getlessonData (id) {
      return lessonDetailApi(id)
    },
    /* 获取课节打卡列表 */
    getCourseCardListApi (id) {
      this.jsonData.course_section_id = id
      let jsonDataString = JSON.stringify({search: this.jsonData})
      let UrlString = encodeURIComponent(jsonDataString)
      let param = {
        jsonData: UrlString,
        page: this.listPage,
        pageCount: 20
      }
      return getCourseCardListApi(param)
    },
    toMindDetail () {
      this.$router.push({path: '/punchDetail', query: {id: this.communityCourse.peopleCardInfo.id, courseId: this.communityCourse.courseSectionId}})
    },
    toPunch () {
      this.$router.push({path: '/punchEdit', query: {id: this.communityCourse.courseSectionId}})
    },
    backCourse () {
      this.$router.go(-1)
    },
    /* 置顶 */
    async setPostTop (item) {
      console.log(item)
      this.addActionsConfig.show = true
      this.nowChoosePunch = item
    },
    async handleAddActoinItem (key, item) {
      if (!item) return
      let { id } = this.$route.query
      console.log(this.nowChoosePunch.isExcellentCard === 0, this.nowChoosePunch.isExcellentCard)
      let param = {
        course_section_card_id: this.nowChoosePunch.courseSectionCardId,
        is_set_excellent_card: this.nowChoosePunch.isExcellentCard === 0 ? 1 : 0
      }
      await setExcellentCourseCardApi(param)
      let cardList = await this.getCourseCardListApi(id)
      this.peopleCourseCardList = cardList.data.peopleCourseCardList
      this.excellentPunchList = cardList.data.excellentPeopleCourseCardList
      if (this.nowChoosePunch.isExcellentCard === 0) {
        this.$toast({text: '设置优秀打卡成功', type: 'success'})
      } else {
        this.$toast({text: '已取消优秀打卡'})
      }
    },
    /* 去打卡列表 */
    toPunchList (to) {
      this.$router.push({path: '/punchList', query: {type: to, id: this.communityCourse.courseSectionId}})
    },
    playVideo () {
      this.videoPlay = false
      this.$refs['video'].play()
    }
  },
  created () {
    this.init()
  },
  beforeDestroy () {
    if (window.audio) {
      window.audio.pause()
    }
  }
}
</script>
<style lang="less">
.lesson{
  padding-bottom: 49px;
  .lesson-header{
    .header-photo{
      width: 100%;
      height: 175px;
    }
    .header-title{
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      margin-top: 25px;
      font-size: 42px;/*px*/
      font-weight: 700;
      color: #354048;
    }
    .header-info{
      color: #666666;
      margin-top: 20px;
      box-sizing: border-box;
      width: 100%;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 28px;/*px*/
     .left{
       display: flex;
       align-items: center;
     }
     .mast-name{
       margin-right: 20px;
       margin-left: 8px;
     }
     span{
       font-weight: 300;
     }
     img{
       width: 24px;
       height: 24px;
       border-radius: 50%;
     }
     .backCourse{
       font-weight: 500;
       font-size: 26px;/*px*/
       color: #4080AD;
     }
    }
  }
  .lesson-module{
    margin-top: 30px;
    /*课节视频*/
    .lesson-video{
      margin-top: 28px;
      padding: 0 20px;
      height: 187px;
      position: relative;
      .videoBOx{
        box-sizing: border-box;
        margin: 0 20px;
        width: 335px;
        height: 187px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9998;
        background-color: #000000;
        i{
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
          font-size: 50px;
          color: #FFFFFF;
          z-index: 9999;
        }
      }
    & .placeholder {
        position: absolute;
        top: 0;
        left: 20px;
        width: 335px;
        height: 187px;
        background: rgba(0, 0, 0, .8) url('./../../assets/icon/video-play.png') no-repeat center;
        & img {
          width: 100%;
          height: 100%;
        }
      }
      & video {
        background: #000000;
        width: 100%;
        height: 187px;
      }
    }
    /*音频内容*/
    .content-audio{
      margin-top: 28px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    /*课节富文本*/
    .module-content{
      color: #354048;
      box-sizing: border-box;
      padding: 0 20px;
      margin-top: 30px;
      width: 100%;
      font-size: 30px; /*px*/
      line-height: 1.4;
      font-weight: 300;
      color: #354048;
      word-break: break-all;
    }
    /* 音频样式 */
    .audioBox{
      padding: 0 20px;
      >.aduio{
        border-radius: 30px;
        width: 335px;
        height: 60px;
        padding: 19px 25px;
        .playBtn{
          margin-right: 29px;
        }
      }
    }
  }
  .lesson-task{
    padding: 0 20px;
    .content-txt{
      font-size: 30px; /*px*/
      line-height: 1.4;
      font-weight: 300;
      color: #354048;
    }
    .content-img{
      & .content-images {
        margin-top: 10px;
        width: 335px;
        display: flex;
        flex-flow: row wrap;
        & > .item-image {
          margin-top: 5px;
          margin-left: 5px;
          width: 108px;
          height: 108px;
          text-align: center;
          flex-grow:0;
          &:first-of-type, &:nth-of-type(3n + 1) {
            margin-left: 0;
          }
          & img {
            background: #f9f9f9;
            width: 100%;
            height: 100%;
            object-fit: cover;
            vertical-align: middle;
          }
        }
        & > .item-image.one {
          width: 136px;
          height: 136px;
        }
      }
    }
  }
  .lesson-punch{
    .headerBox{
      margin-left: 20px;
    }
    .no-punch{
      color: #929292;
      font-size: 28px;/*px*/
      padding: 0 54px;
      padding-bottom: 169px;
      padding-top: 45px;
      text-align: center;
    }
  }
  .lesson-punch,
  .all-punch{
    .excellent-punch{
      padding: 0 20px;
      box-sizing: border-box;
      width: 100%;
      .excellent-punch-title{
        color:#929292;
        font-size: 36px;/*px*/
        font-weight: 700;
        padding-left: 15px;
        height: 22px;
        width: 100%;
        position:relative;
        margin-bottom: 10px;
        &::before{
          content: '';
          position: absolute;
          top: 2.5px;
          left: 0;
          width: 5px;
          height: 17px;
          background-color: #FFE266;
        }
      }
    }
    /*优秀打卡与所有打卡的间距*/
    .excellentPunchList{
      margin-bottom: 50px;
      >.dynamic-item{
        box-sizing: border-box;
        padding: 0 20px;
        &:last-child{
          border-bottom: none;
        }
      }
    }
    /*底部展开按钮*/
    .expand-btn{
      position: relative;
      padding: 0 20px;
      box-sizing: border-box;
      &::before{
        content: "";
        position: absolute;
        top: -1px;
        left: 0;
        background: #FFFFFF;
        height: 2px;
        width: 100%;
        z-index: 8888;
      }
      >div{
        font-weight: 300;
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;/*px*/
        color: #354048;
        background-color: #FFFAE6;
        border-radius: 20px;
        &>span{
          padding-left: 7px;
        }
      }
    }
    >.dynamic-item{
      box-sizing: border-box;
      padding: 0 20px;
    }
  }
  .hr{
    width: 375px;
    height: 0.5px;
    background: #EDEDED;
  }
  .all-punch{
    .all-show{
      margin-bottom: 50px;
    }
    >.dynamic-item{
      &:last-child{
        border-bottom: none;
      }
    }
  }
  .lesson-footer{
    background-color: #FFFFFF;
    width: 100%;
    height: 49px;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9998;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    border-top: 0.5px solid #DCDCDC;
    .toPunch{
      width: 100%;
      height: 100%;
      background-color: #FFE266;
      line-height: 49px;
      text-align: center;
      color: #354048;
    }
    .mine{
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #354048;
    }
    .line{
      width: 2px;
      height: 28px;
      background-color: #EDEDED;
    }
  }
  .lesson-punch,.lesson-task{
    margin-top: 60px;
    box-sizing: border-box;
  }
  .headerBox{
    width: 100%;
    height: 54px;
    margin-bottom: 30px;
    position: relative;
    .title-pic1{
      width: 330px;
      height: 46px;
      border: 1.5px solid #354048;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      text-align: center;
      background-color: #FFFFFF;
      .txt{
        display: inline-block;
        text-align: center;
        line-height: 46px;
        font-size: 36px;/*px*/
        font-weight: 700;
        color: #354048;
        padding: 0 19px;
        position: relative;
        &::before{
          content: '';
          position: absolute;
          top: 24px;
          left: -27.5px;
          width: 27.5px;
          height: 1.5px;
          background-color: #929292;
        }
        &::after{
          content: '';
          position: absolute;
          top: 24px;
          right: -27.5px;
          width: 27.5px;
          height: 1.5px;
          background-color: #929292;
        }
      }
    }
    .title-pic2{
      width: 330px;
      height: 46px;
      border: 1.5px solid #354048;
      background-color: #FFE266;
      position: absolute;
      left: 5px;
      top: 5px;
      z-index: 0;
    }
  }
}
</style>