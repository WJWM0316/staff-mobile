<template>
  <div class="wrap">
    <div class="headBox"></div>
    <div class="head" v-if="headInfo" @click.stop="toCenter">
      <div class="welcome">
        <div class="text">
          <span class="name">{{headInfo.base.realname | ellipsis(8)}}</span>，欢迎回来～
          <p class="msg">你的学习时长已超越 <span class="num">{{headInfo.study.surpass}}%</span> 的同事啦！</p>
        </div>
        <div class="photo" v-if="headInfo.base.avatar"><img :src="headInfo.base.avatar.middleUrl" alt=""></div>
      </div>
      <div class="studyInfo">
        <div class="item">
          <p class="num">{{headInfo.study.studyTimeCount}}</p>
          <p class="txt">学习时长/小时</p>
        </div>
        <div class="item">
          <p class="num">{{headInfo.study.lessonCount}}</p>
          <p class="txt">在学课程数/个</p>
        </div>
        <div class="item">
          <p class="num">{{headInfo.study.sessionCardCount}}</p>
          <p class="txt">打卡数/节</p>
        </div>
      </div>
    </div>
    <template v-if="homeInfo">
      <div class="live" v-if="homeInfo.lives">
        <div class="time"><span class="inner" :class="homeInfo.lives[0].status === 1 ? 'notBegin' : 'begin'">{{liveData.status}}<span v-if="liveData.date">·{{homeInfo.lives[0].expectedStartTime * 1000 | date(liveData.date)}}</span></span></div>
        <div class="content" @click.stop="jump('liveDetail', homeInfo.lives[0].liveId)">
          <img class="icon1" src="@a/icon/list_icon_live@3x.png" alt="">
          <div class="msg">
            <p class="liveTitle">{{homeInfo.lives[0].title}}</p>
            <p class="name"><span v-if="homeInfo.lives[0].groupName">{{homeInfo.lives[0].groupName}} | </span>{{homeInfo.lives[0].realname}}</p>
          </div>
          <img class="icon2" src="@a/icon/83714243584516615.png" alt="">
        </div>
      </div>
      <div class="course" :class="{'padTop': !homeInfo.lives}">
        <!-- 正在学习 -->
        <div class="title border-bottom-1px"><i class="icon"></i>正在学习</div>
        <template v-if="homeInfo.courses">
          <infoCard
            v-for="(n, index) in homeInfo.courses"
            :key="index"
            :item="n"
            v-if="index < 6"
            type="1"
          ></infoCard>
          <div class="btnBox" v-if="homeInfo.courses.length > 5"><div class="btn" @click.stop="jump('myCourse')">查看所有课程</div></div>
        </template>
        <!-- 去选课 -->
        <template v-else>
          <div class="noCourse">
            <p class="txt">还没有学习任何课程～</p>
            <xButton class="jumpBtn" @click.stop.native="jump('course')">去选课</xButton>
          </div>
        </template>
        <!-- 推荐课程 -->
        <template v-if="homeInfo.topCourse">
          <div class="title"><i class="icon"></i>推荐课程</div>
          <div class="scrollX">
            <div class="courseItem" v-for="(n, index) in homeInfo.topCourse" :key="index">
              <infoCard
                :item="n"
                type="1"
                :needProgress="false"
                :ellipsis2="true"
                :recommend="true"
              ></infoCard>
            </div>
          </div>
          <div class="btnBox btn1"><div class="btn" @click.stop="jump('course')">发现更多课程</div></div>
          <div class="title"><i class="icon"></i>更多学习</div>
        </template>
        <div class="enter">
          <img src="@a/icon/p1.png"  @click.stop="jump('liveList')">
          <img src="@a/icon/p2.png"  @click.stop="jump('bookHouse')">
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { userInfoApi } from '@/api/pages/center'
import { getHomeInfoApi } from '@/api/pages/home'
import { mapState } from 'vuex'
import infoCard from '@c/business/infoCard.vue'
import localstorage from '@u/localstorage'
export default {
  components: {
    infoCard
  },
  data () {
    return {
      homeInfo: null,
      headInfo: null
    }
  },
  watch: {
  },
  computed: {
    ...mapState({
      userInfo: state => state.global.userInfo
    }),
    liveData () {
      // 直播未开始状态
      let data = {}
      if (this.homeInfo.lives[0].status === 1) {
        data.status = '直播预告'
        // 超过一天
        if (this.homeInfo.lives[0].expectedStartTime * 1000 - new Date().getTime() > 24 * 3600 * 1000) {
          data.date = 'MMMDo HH:mm'
        } else {
          data.date = 'HH:mm'
        }
      } else {
        data.status = '直播进行中'
      }
      return data
    }
  },
  methods: {
    toCenter () {
      this.$router.push('/personalPage')
    },
    getHomeInfo () {
      getHomeInfoApi({count: 6}).then(res => {
        this.homeInfo = res.data
      })
    },
    getUserInfo () {
      if (!this.userInfo) {
        userInfoApi().then(res => {
          this.headInfo = res.data
          this.$store.dispatch('updata_userInfo', res.data)
        })
      } else {
        this.headInfo = this.userInfo
      }
    },
    jump (type, id) {
      switch (type) {
        case 'liveDetail':
          this.$router.push(`/liveDetail?id=${id}`)
          break
        case 'liveList':
          this.$router.push('/live')
          break
        case 'course':
          this.$router.push('/course')
          break
        case 'myCourse':
          this.$router.push('/myCourse')
          break
        case 'bookHouse':
          this.$router.push('/bookHouse')
          break
      }
    },
    init () {
      this.getHomeInfo()
      this.getUserInfo()
    }
  },
  mounted () {
    localstorage.set('curHome', 'home') // 当前首页为员工端首页
    this.init()
  }
}
</script>
<style lang="less" scoped>
  .wrap {
    .headBox {
      width: 100%;
      height: 145px;
      position: relative;
      background: #f2f2f2;
    }
    .head {
      width: 345px;
      height: 178px;
      background: #fff;
      position: absolute;
      top: 15px;
      left: 50%;
      margin-left: -172px;
      box-shadow: 0px 4px 12px 0px rgba(69,46,16,0.08);
      border-radius: 3px;
      padding: 25px 0 22px;
      box-sizing: border-box;
      .welcome {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        .text {
          font-size: 48px; /*px*/
          color: #D7AB70;
          line-height: 28px;
          .msg {
            margin-top: 3px;
            font-size: 24px; /*px*/
            line-height: 16px;
            color: #666666;
            font-weight: 300;
            .num {
              color: #D7AB70;
            }
          }
        }
        .photo {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }
      }
      .studyInfo {
        display: flex;
        align-items: center;
        margin-top: 17px;
        .item {
          flex: 1;
          text-align: center;
          .num {
            font-size: 76px; /*px*/
            color: #354048;
            padding-top: 6px;
            height: 44px;
            line-height: 44px;
            font-family: 'MyNewFont'
          }
          .txt {
            font-size: 24px; /*px*/
            color: #929292;
            font-weight: 300;
            line-height: 16px;
          }
        }
      }
    }
    .live {
      margin-top: 88px;
      padding: 0 15px 0 20px;
      .time {
        text-align: center;
        color: #929292;
        font-size: 24px; /*px*/
        line-height: 16px;
        background: url('../../assets/icon/xie.png') repeat-x center center;
        background-size: auto 10px;
        .inner {
          display: inline-block;
          padding: 0 10px 0 20px;
          background: #fff;
          position: relative;
          font-weight: 300px;
          &.notBegin::after {
            content: '';
            display: block;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #FFE266;
            position: absolute;
            top: 50%;
            margin-top: -2.5px;
            left: 10px;
          }
          &.begin::after {
            content: '';
            display: block;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: #FA6A30;
            position: absolute;
            top: 50%;
            margin-top: -2.5px;
            left: 10px;
          }
        }
      }
      .content {
        margin-top: 12px;
        padding: 0 27px 0 60px;
        position: relative;
        height: 48px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        .setEllipsis();
        .msg {
          width: 100%;
          .liveTitle {
            color: #354048;
            font-size: 30px; /*px*/
            line-height: 20px;
            font-weight: 300;
            .setEllipsis();
          }
          .name {
            color: #929292;
            font-size: 24px; /*px*/
            line-height: 16px;
            font-weight: 300;
            margin-top: 2px;
          }
        }
        .icon1 {
          width: 48px;
          height: 48px;
          position: absolute;
          top: 0;
          left: 0;
        }
        .icon2 {
          width: 8px;
          height: 14px;
          position: absolute;
          top: 50%;
          margin-top: -4px;
          right: 5px;
        }
      }
    }
    .course {
      &.padTop {
        padding-top: 38px;
      }
      .noCourse {
        padding-top: 39px;
        text-align: center;
        font-size: 30px; /*px*/
        font-weight: 300;
        color: #354048;
        line-height: 20px;
        .jumpBtn {
          width: 210px;
          height: 44px;
          border-radius: 50px;
          margin: 15px auto 40px;
        }
      }
      .title {
        padding: 50px 20px 10px;
        font-size: 40px; /*px*/
        line-height: 24px;
        color: #929292;
        font-weight: 700;
        .icon {
          width: 6px;
          height: 20px;
          display: inline-block;
          background: #FFE266;
          margin-right: 12px;
          vertical-align: -3px;
        }
      }
      .btnBox {
        padding: 0 20px;
        margin-top: 15px;
        &.btn1 {
          margin-top: 0px;
        }
        .btn {
          width: 100%;
          height: 44px;
          line-height: 44px;
          text-align: center;
          border-radius: 22px;
          background: #F8F8F8;
          color: #666;
          font-size: 28px; /*px*/
          font-weight: 300;
        }
      }
      .scrollX {
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        font-size: 0;
        margin-bottom: 10px;
        padding: 0 15px 10px;
        box-sizing: border-box;
        .courseItem {
          width: 284px;
          display: inline-block;
          background: #fff;
          box-shadow: 0px 3px 10px 0px rgba(0,0,0,0.07);
          border-radius: 3px;
          margin-right: 10px;
          vertical-align: top;
          &:last-child {
            margin-right: 0;
          }
        }
      }
      .enter {
        width: 100%;
        padding: 0px 20px 25px 20px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        img {
          width: 163px;
          height: 80px;
          display: block;
          border-radius: 2px;
        }
        img:first-child {
          margin-right: 9px;
        }
      }
    }
  }
</style>