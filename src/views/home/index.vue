<template>
  <div class="wrap">
    <div class="headBox"></div>
    <div class="head" v-if="headInfo">
      <div class="welcome">
        <div class="text">
          <span class="name">{{headInfo.base.realname | ellipsis(8)}}</span>,欢迎回来～
          <p class="msg">你的学习时长已超越<span class="num">{{headInfo.study.surpass}}%</span>的同事啦</p>
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
          <p class="txt">正在学习课/个</p>
        </div>
        <div class="item">
          <p class="num">{{headInfo.study.sessionCardCount}}</p>
          <p class="txt">打卡数/节</p>
        </div>
      </div>
    </div>
    <template v-if="homeInfo">
      <div class="live" v-if="homeInfo.lives">
        <div class="time">直播预告·{{homeInfo.lives[0].expectedStartTime * 1000 | date('MMMDo h:mm')}}</div>
        <div class="content" @click.stop="jump('liveDetail', homeInfo.lives[0].liveId)">
          <img class="icon1" src="@a/icon/list_icon_live@3x.png" alt="">
          <div class="msg">
            <p class="liveTitle">{{homeInfo.lives[0].title}}</p>
            <p class="name">{{homeInfo.lives[0].groupName}} | {{homeInfo.lives[0].realname}}</p>
          </div>
          <img class="icon2" src="@a/icon/list_live_icon_more@3x.png" alt="">
        </div>
      </div>
      <div class="course">
        <div class="title border-bottom-1px"><i class="icon"></i>正在学习</div>
        <infoCard
          v-for="(n, index) in homeInfo.courses"
          :key="index"
          :item="n"
          type="1"
        ></infoCard>
        <div class="btnBox"><div class="btn" @click.stop="jump('course')">查看所有课程</div></div>
        <div class="title"><i class="icon"></i>推荐课程</div>
        <div class="scrollX">
          <div class="courseItem" v-for="(n, index) in homeInfo.topCourse" :key="index">
            <infoCard
              :item="n"
              type="1"
            ></infoCard>
          </div>
        </div>
        <div class="btnBox"><div class="btn" @click.stop="jump('course')">发现更多课程</div></div>
        <div class="title"><i class="icon"></i>更多学习</div>
        <div class="enter" @click.stop="jump('liveList')">
          <img src="@a/icon/home_banner_right@3x.png" alt="">
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
    })
  },
  methods: {
    getHomeInfo () {
      getHomeInfoApi().then(res => {
        this.homeInfo = res.data
      })
    },
    getUserInfo () {
      if (!this.userInfo) {
        userInfoApi().then(res => {
          this.headInfo = res.data
          this.$store.dispatch('updata_userInfo', res.data)
          if (res.data.base.mobile === '13729280262' || res.data.base.mobile === '18520225811') {
            window.localStorage.setItem('XPLUSCompany', 'test')
          } else {
            window.localStorage.setItem('XPLUSCompany', 'tiger')
          }
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
      }
    },
    init () {
      this.getHomeInfo()
      this.getUserInfo()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
  .wrap {
    .headBox {
      width: 100%;
      height: 145px;
      background: #F2F2F2;
      position: relative;
    }
    .head {
      width: 345px;
      height: 178px;
      background: #fff;
      position: absolute;
      top: 15px;
      left: 15px;
      box-shadow: 0px 4px 12px 0px rgba(69,46,16,0.08);
      border-radius: 3px;
      padding: 25px 20px 22px;
      box-sizing: border-box;
      .welcome {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .text {
          font-size: 48px; /*px*/
          font-weight: 300;
          color: #D7AB70;
          line-height: 28px;
          .msg {
            margin-top: 3px;
            font-size: 24px; /*px*/
            line-height: 16px;
            color: #666666;
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
            font-weight: 500;
            line-height: 50px;
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
      }
      .content {
        margin-top: 5px;
        padding: 0 27px 0 70px;
        position: relative;
        height: 56px;
        display: flex;
        align-items: center;
        .setEllipsis();
        .msg {
          width: 100%;
          .liveTitle {
            color: #354048;
            font-size: 30px; /*px*/
            line-height: 20px;
            font-weight: 300;
          }
          .name {
            color: #929292;
            font-size: 24px; /*px*/
            line-height: 16px;
            font-weight: 300;
          }
        }
        .icon1 {
          width: 56px;
          height: 56px;
          position: absolute;
          top: 0;
          left: 0;
        }
        .icon2 {
          width: 30px;
          height: 30px;
          position: absolute;
          top: 50%;
          margin-top: -15px;
          right: 0;
        }
      }
    }
    .course {
      .title {
        padding: 50px 20px 0;
        font-size: 40px; /*px*/
        line-height: 24px;
        color: #929292;
        padding-bottom: 10px;
        .icon {
          width: 6px;
          height: 20px;
          display: inline-block;
          background: #FFE266;
          margin-right: 12px;
          vertical-align: -4px;
        }
      }
      .btnBox {
        padding: 0 20px;
        .btn {
          width: 100%;
          height: 44px;
          line-height: 44px;
          text-align: center;
          border-radius: 22px;
          background: #F8F8F8;
          font-size: 28px; /*px*/
          font-weight: 300;
        }
      }
      .scrollX {
        width: 100%;
        overflow-x: auto;
        white-space: nowrap;
        font-size: 0;
        margin-bottom: 20px;
        .courseItem {
          width: 284px;
          display: inline-block;
          background: #fff;
          box-shadow: 0px 6px 20px 0px rgba(0,0,0,0.07);
          border-radius: 3px;
          padding-right: 10px;
        }
      }
      .enter {
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
        img {
          width: 100%;
          display: block;
        }
      }
    }
  }
</style>