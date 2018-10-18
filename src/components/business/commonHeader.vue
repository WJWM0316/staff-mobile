<template>
  <div class="m-community">
    <!--灯塔头部-->
    <div class="cover-container" :class="{circle: type === '2'}">
      <div class="cover"></div>
      <span class="header-photo"  v-if="pageInfo.coverImg">
        <img :src="pageInfo.coverImg.middleUrl"/>
      </span>
      <backHome :type="type"></backHome>
    </div>

    <div class="info" v-if="type !== '2'">
      <h3 class="title">{{pageInfo.title}}</h3>
      <p class="desc">{{pageInfo.groupName || '未设置所属部门'}} | {{pageInfo.realname}}</p>
    </div>
    <div class="circleHeader" v-else>
      {{pageInfo.title}}
    </div>
    <!--左边加入人数-->
    <div class="member" @click.stop="toMemberList">
      <div class="left">
        <p><span class="num">{{pageInfo.memberCount}}</span> 人</p>
        <p v-if="isLive">参与了直播</p>
        <p v-else>和你一起学习</p>
      </div>
      <!--加入人员头像-->
      <div class="center">
        <img class="user_icon defaultImg" v-for="(item, index) in pageInfo.memberInfo" :src="item.avatarInfo.smallUrl" :key="index" />
        <img class="user_icon four" src="../../assets/icon/firends-call-more.png" v-if="pageInfo.memberCount > 3"/>
      </div>
      <!--右边入口按钮-->
      <div class="right" v-if="type !== '2'">
        <div v-if="pageInfo.isJoin || pageInfo.isMaster" @click.stop="toIntroduction">
          课程介绍<img class="to_img" src="../../assets/icon/bnt_arrow_int@3x.png"/>
        </div>
      </div>
      <div v-else>
        <div class="right" @click.stop="toSetting" v-if="type === '2' && ((pageInfo.isMember || pageInfo.isOwner) || (!pageInfo.isMember && pageInfo.isAttention))">
            设置<img class="to_img" src="../../assets/icon/bnt_arrow_int@3x.png"/>
        </div>
        <div class="focus" @click.stop="focus" v-else>
          + 关注
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { putFocusApi } from '@/api/pages/workCircle'
import backHome from '@c/layout/backHome'
export default {
  components: {
    backHome
  },
  name: 'courseHeader',
  props: {
    type: {
      type: Number,
      default: 0 // 1课程 2工作区 3直播
    },
    pageInfo: {
      type: Object
    }
  },
  methods: {
    toSetting () {
      this.$router.push({path: '/setting', query: {id: this.pageInfo.id}})
    },
    focus () {
      console.log(' guanzhu ')
      putFocusApi(this.pageInfo.id).then(res => {
        this.pageInfo.isAttention = true
      })
    },
    // 去课程介绍页
    toIntroduction () {
      this.$router.push({path: '/courseDetail', query: {id: this.pageInfo.id, isCourseIntroduce: true}})
      this.$emit('toCourseIntroduce')
    },
    /* 去成员列表 */
    toMemberList () {
      if (this.type === '2') {
        this.$router.push({path: '/circleMemberList', query: {id: this.pageInfo.id}})
      } else if (this.type === '3') {
        this.$router.push({path: '/liveMemberList', query: {id: this.pageInfo.liveId}})
      } else {
        this.$router.push({path: '/memberList', query: {id: this.pageInfo.id}})
      }
    }
  },
  mounted () {}
}
</script>

<style lang="less" type="text/less">
@import url("~STYLE/mixins.less");
.m-community {
  display: block;
  .cover-container {
      .cover {
        background: #F2F2F2;
        width: 100%;
        height: 90px;
      }
      /*头部改变新增属性*/
      position: relative;
      height: 90px;
      .header-photo{
          display:block;
          width:110px;
          height: 110px;
          box-shadow:0px 4px 19px 0px rgba(75,65,50,0.17);
          position: absolute;
          top: 15px;
          left:50%;
          transform:translateX(-50%);
          margin-bottom:3.75px;
          >img{
            border-radius: 6px;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 0.5px solid #ffffff;
          }
      }
    }
    .circle{
      height: 101px;
      .cover{
        height: 101px;
      }
      .header-photo{
        box-shadow: none;
        width: 80px;
        height: 80px;
        top: 42px;
        >img{
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
      }
    }
  .circleHeader{
    color: #354048;
    font-size: 36px;/*px*/
    font-weight: 500;
    line-height: 22px;
    margin: 29px 0 23px;
    text-align: center;
  }
  .info {
    .title {
      padding: 0 20px;
      margin-top: 55px;
      display: block;
      line-height: 23px;
      font-size: 36px;/*px*/
      font-weight: 500;
      color: #354048;
    }

    .desc {
      padding: 0 20px;
      font-weight: 300;
      font-size: 26px;/*px*/
      display: block;
      margin-top: 6px;
      margin-bottom: 22px;
      line-height: 17px;
      color: #666666;
    }
  }
  .member{
    padding: 0 20px;
    display: flex;
    align-items: center;
    .left{
      margin-right: 15px;
      p{
        color: #929292;
        font-weight: 300;
        font-size: 22px;/*px*/
      }
      .num{
        font-weight: 400;
        color: #D7AB70;
        font-size: 32px;/*px*/
      }
    }
    .center{
      white-space: nowrap;
      margin-right: auto;
      .user_icon{
        border-radius: 50%;
        width: 30px;
        height: 30px;
        border: 0.5px solid #EDEDED;
       margin-left: -11px;
      }
      .user_icon:first-of-type{
        margin-left: 0px;
      }
      .four{
      }
    }
    .right{
      display: flex;
      align-items: center;
      color: #666666;
      font-size: 24px;/*px*/
      font-weight: 300;
      .to_img{
        width: 12px;
        height: 12px;
      }
    }
    .focus{
      width: 65px;
      height: 25px;
      border: 1px solid #D7AB70;/*px*/
      text-align: center;
      line-height: 25px;
      font-size: 24px;/*px*/
      color: #D7AB70;
      font-weight: 500;
      border-radius: 15px;
    }
  }
}
</style>