<template>
  <!--课节页面-->
  <div class="Lesson" v-if="communityCourse">
    <!--头部图片标题区-->
    <div class="Lesson-header">
      <div class="header-title">
        {{communityCourse.title}}
      </div>
      <div class="header-info">
        <div><img :src="communityCourse.releaseUser.avatar.smallUrl"/><span class="mast-name">{{communityCourse.releaseUser.username}}</span></div>
        <div>{{communityCourse.createTime}}</div>
      </div>
    </div>
    <!--富文本区-->
    <div class="Lesson-module">
      <div class="module-header">
        <div class="head-photobox">
          <img v-if="communityCourse.people" :src="communityCourse.people.avatar"/>
          <span class="name" v-if="communityCourse.people">{{communityCourse.people.realname}}</span>
        </div>
        <div class="date">{{communityCourse.createTime*1000}}</div>
      </div>
      <!--视频-->
      <div class="Lesson-video" @click.stop="playVideo($event)" v-if="communityCourse.av && communityCourse.av.type==='video'">
        <video controls ref="video" v-show="!videoPlay"></video>
        <div class="placeholder" v-show="videoPlay">
          <!--背景图-->
          <!--<img />-->
        </div>
      </div>
      <!-- 音频 -->
      <div :class="{'content-audio': true, 'not-played': !communityCourse.av.files[0].isPlayed}" v-if="communityCourse.av && communityCourse.av.type==='audio'">
      </div>
      <div class="module-content h5-code" @click.stop="readPic($event)" v-html="communityCourse.details" ref="H5">
      </div>
    </div>

    <!-- 已加入 -->
    <template>
        <!--本节任务-->
        <div class="Lesson-task" v-if="communityCourse.punchCardTitle || communityCourse.punchCardImgInfo.length>0">
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
            <!--<img v-for="item in community_course.punch_card_img_info" :src="item.picture_url" alt="" />-->
            <div class="content-images">
              <!-- 图片为 1 张时 -->
              <div class="item-image one" v-if="communityCourse.punchCardCImgInfo && communityCourse.punchCardCImgInfo.length === 1">
                <img :src="communityCourse.punchCardCImgInfo[0].url || '@/assets/icon/img_head_default.png'" @click.stop="previewImage(communityCourse.punchCardCImgInfo[0].pictureUrl)" />
              </div>

              <!--  图片为 多 张时  -->
              <div class="item-image" v-for="(file, index) in communityCourse.punchCardCImgInfo" :key="index" v-else>
                <img :src="file.pictureUrl || '@/assets/icon/img_head_default.png'" v-if="!file.holder" @click.stop="previewImage(file.pictureUrl)" />
              </div>
            </div>
          </div>
        </div>
        <!--本节任务结束-->
        <!--优秀打卡区-->
        <div class="Lesson-punch">
          <!--头部标题-->
          <div class="headerBox" v-if="(excellentPunchList && excellentPunchList.length>0) || (peopleCourseCardList && peopleCourseCardList.length>0)">
            <div class="title-pic1">
              <span class="txt">打卡区</span>
            </div>
            <div class="title-pic2"></div>
          </div>
          <!--优秀头部标题图片-->
          <div class="excellentPunchList"  v-if="excellentPunchList && excellentPunchList.length>0">
            <div class="Excellent-punch">
              <div class="Excellent-punch-title">优秀打卡</div>
            </div>
            <div class="hr"></div>
            <!--优秀打卡内容区-->
            <lessondynamicItem
               v-for="(item, index) in excellentPunchList"
               :key = "index"
               :item="item"
               :showDelBtn="true"
               :communityId="communityId"
               :isFold="true"
               :isNeedHot="true"
               :hideBorder="false"
               :isLesson="true"
               :disableContentClick="false"
               @disableOperationEvents="operation"
               @reFresh="reFresh"
               @showEvaluate='showEvaluate'
            ></lessondynamicItem>
            <div class="Expand-btn" @click.stop="toPunchList('excellent')" v-if="countCardInfo.totalExcellentCardCount>5">
              <div>
                查看所有优秀打卡 <span>({{countCardInfo.totalExcellentCardCount}})</span>
              </div>
            </div>
          </div>
        </div>
        <!--所有打卡区-->
        <div class="all-punch" v-if="trialReading === '0' && peopleCourseCardList && peopleCourseCardList.length>0">
          <div class="Excellent-punch">
            <div class="Excellent-punch-title">所有打卡</div>
          </div>
          <div class="hr"></div>
          <lessondynamicItem
             v-for="(item, index) in peopleCourseCardList"
             :key = "index"
             :item="item"
             :showDelBtn="true"
             :communityId="communityId"
             :isFold="true"
             :isNeedHot="true"
             :hideBorder="false"
             :isLesson="true"
             :disableContentClick="false"
             @disableOperationEvents="operation"
             @reFresh="reFresh"
             @showEvaluate='showEvaluate'
          ></lessondynamicItem>
          <div class="Expand-btn all-show" @click.stop="toPunchList('all')" v-if="countCardInfo.totalCardCount>5">
            <div>
              查看所有打卡 <span>({{countCardInfo.totalCardCount}})</span>
            </div>
          </div>
        </div>
        <!--底部打卡按钮区-->
        <!--<div v-if="trialReading === '0' || (curPeopleInfo.roleId!==1 && curPeopleInfo.roleId!==2) || curPeopleInfo.roleId">-->
        <div v-if="curPeopleInfo.roleId!==1 && curPeopleInfo.roleId!==2 && trialReading === '0'">
          <div class="Lesson-footer" v-if="isPunch === 0">
            <div class="toPunch" @click.stop="toPunch">
              打卡做任务，解锁下一节课
            </div>
          </div>
          <div class="Lesson-footer" v-else>
              <div class="peacock" @click.stop="toPoster()">炫耀一下</div><span class="line"></span>
              <div class="mine" @click.stop="toMindDetail(communityCourse.peopleId,communityCourse.id)">我的打卡</div>
          </div>
        </div>
    </template>
    <actionsheet v-model="addActionsConfig.show" :menus="isExcellentCard?addActionsConfig.menus2:addActionsConfig.menus" show-cancel @on-click-menu="handleAddActoinItem" />
  </div>
</template>
<script>
import Vue from 'vue'
import lessondynamicItem from '@/components/dynamicItem/dynamicItem'
// import WechatMixin from '@/mixins/wechat'
import { Actionsheet } from 'vux'
import { getCourseCardListApi, setExcellentCourseCardApi, lessonDetailApi } from '@/api/pages/course'
export default {
  name: 'lesson',
  components: {
    lessondynamicItem,
    Actionsheet
  },
  data () {
    return {
      video: '', // 视频
      videoPlay: true, // 视频是否在播放
      showIdentification: true,
      disableOperationArr: ['comment'],
      isPlayList: false,
      // 假音频数据
      /* item = {
        files:[{
          duration:250,
          fileId:"6237",
          fileUrl:"https://cdnstatic.ziwork.com/test/audio/2018-08-15/4bd491cb8292450b62b387a595f15ee8.mp3",
          avatar:"2JVOTrwtULW3VpcKI3whmcDNYTlTMEVQzPpxN3ZDfXOcFYKtUiv7XZwjXolTara2.amr"
        }],
      } */
      // 所有打卡数据
      peopleCourseCardList: '',
      // 优秀打卡
      excellentPunchList: '',
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
      // 试读。未加入相关
      lessonData: {},
      usedUserCouponId: 0, // 支付时使用的优惠券id
      selectCouponItem: {}, // 当前选择的优惠券信息
      selectedPrice: '', // 选择其他优惠券后的价格
      toPay: false, // 是否调起支付窗口
      isHintShow: false, // 弹窗
      hintData: {
        title: '加入须知',
        buttonText: '马上加入',
        cancelText: '我再想想',
        content: [
          '该课程已经全部更新完毕了！',
          '加入后你获得以下内容：',
          '1、塔主课程以及小伙伴们沉淀 下来的宝贵内容；',
          '2、和成员们一起交流学习；',
          '3、提问导师或嘉宾，但不一定 能100%得到回答'
        ]
      },
      jsonData: [ // 获取课节详情的筛选条件参数
        {course_section_id: 1}
      ],
      listPage: 1, // 当前打卡列表的页数
      endPayType: null // 已结束 加入时候的状态
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
      let res = await this.getLessonData(id)
      let cardList = await this.getCourseCardListApi(id)
      this.communityCourse = res.data
    },
    /* 获取课节详情 */
    getLessonData (id) {
      return lessonDetailApi(id)
    },
    /* 获取课节打卡列表 */
    getCourseCardListApi (id) {
      this.jsonData[0].course_section_id = id
      let jsonDataString = JSON.stringify({search: this.jsonData})
      let UrlString = encodeURIComponent(jsonDataString)
      let param = {
        jsonData: UrlString,
        page: this.listPage,
        pageCount: 20
      }
      return getCourseCardListApi(param)
    },
    /* 播放视频 */
    playVideo () {
      console.log(' 播放视频 ')
    },
    /**
     * 点击添加选项item
     * @param {*} key
     * @param {*} item
     */
    async handleAddActoinItem (key, item) {}
  },
  created () {
    this.init()
    console.log(this.communityCourse, ' 5555555555555555555 ')
  }
}
</script>

<style lang="less" scoped>
  .Lesson{
    padding-bottom: 49px;
    /*课节头部*/
    .Lesson-header{
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
        margin-top: 20px;
        box-sizing: border-box;
        width: 100%;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        font-size: 28px;/*px*/
       .mast-name{
         margin-left: 8px;
       }
       img{
         width: 24px;
         height: 24px;
         border-radius: 50%;
       }
      }
    }
    /*课节富文本*/
    .Lesson-module{
      margin-top: 15px;
      .module-header{
        padding: 0 20px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        .head-photobox{
          display: flex;
          align-items: center;
          img{
            border-radius: 50%;
            width: 24px;
            height: 24px;
          }
          .name{
            margin-left: 8px;
            font-size: 28px;/*px*/
            color: #666666;
          }
        }
        .date{
          font-weight: 300;
          color: #666666;
          font-size: 28px;/*px*/
        }
      }
      /*课节视频*/
      .Lesson-video{
        margin-top: 28px;
        padding: 0 20px;
        height: 187px;
        position: relative;
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
        box-sizing: border-box;
        padding: 0 20px;
        margin-top: 30px;
        width: 100%;
        min-height: 400px;
        >section{
          font-size: 32px !important;/*px*/
        }
      }
    }
    /*本节打卡任务*/
    .Lesson-task{
      padding: 0 20px;
      .content-txt{
        width: 100%;
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
    /*优秀打卡和全部打卡的样式区*/
    .Lesson-punch{
      .headerBox{
        margin-left: 20px;
      }
    }
    .Lesson-punch,
    .all-punch{
      /*优秀打卡标签*/
      .Excellent-punch{
        padding: 0 20px;
        box-sizing: border-box;
        width: 100%;
        .Excellent-punch-title{
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
      .Expand-btn{
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
          width: 100%;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;/*px*/
          color: #354048;
          background-color: rgba(255, 226, 102, 0.16);
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
      /*margin-left: -20px;*/
      width: 375px;
      height: 0.5px;
      background: #EDEDED;
    }
    /*所有打卡*/
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
    /*课节底部按钮区*/
    .Lesson-footer{
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
      .peacock,.mine{
        height: 100%;
        width: 50%;
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
    /*公共部分*/
    .Lesson-punch,.Lesson-task{
      margin-top: 60px;
      box-sizing: border-box;
    }
    /*头部标题样式*/
    .headerBox{
      width: 100%;
      height: 54px;
      /*background-color: #C9C9C9;*/
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