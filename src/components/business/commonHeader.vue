<template>
  <div class="m-community">
    <!--灯塔头部-->
    <div class="cover-container" :class="{'circle': type === '2', 'live': type === '3'}">
      <div class="cover" :class="{bgColor : type === '1'}">
        <img v-if="type === '2'" src="@/assets/icon/headerbg.png"/>
      </div>
      <span class="header-photo defaultImg"  v-if="pageInfo.coverImg">
        <img :src="pageInfo.coverImg.middleUrl"/>
      </span>
      <backHome :type="type"></backHome>
    </div>
    <div class="info" v-if="type !== '2'">
      <h3 class="title">{{pageInfo.title}}</h3>
      <p class="desc" v-if="pageInfo.userTitle && pageInfo.userTitle.length > 0"><span v-for="(n, index) in pageInfo.userTitle" :key="index">{{n.title}} |</span> {{pageInfo.realname}}</p>
      <p class="desc" v-else>{{pageInfo.groupName || '未设置所属部门'}} | {{pageInfo.realname}}</p>
    </div>
    <div class="circleHeader" v-else>
      {{pageInfo.name}}
    </div>
    <!--左边加入人数-->
    <div class="member" @click.stop="toMemberList">
      <div class="left" v-if="pageInfo.memberCount !== 0">
        <p><span class="num">{{pageInfo.memberCount}}</span> 人</p>
        <p v-if="type === '3'">参与了直播</p>
        <p v-else>
          <span v-show="type === '2'">和你一起工作</span>
          <span v-show="type === '1'">和你一起学习</span>
        </p>
      </div>
      <!--加入人员头像-->
      <div class="center">
        <img class="user_icon defaultImg" v-for="(item, index) in pageInfo.memberInfo" :src="item.avatarInfo.smallUrl" :key="index" />
        <img class="user_icon four" src="../../assets/icon/firends-call-more.png" v-if="pageInfo.memberCount > 3"/>
      </div>
      <!--右边入口按钮-->
      <div class="right" v-if="type === '1' && pageInfo.isJoin">
        <div v-if="courseIntroduction && (pageInfo.isJoin || pageInfo.isMaster)" @click.stop="toIntroduction">
          课程介绍<img class="to_img" src="../../assets/icon/bnt_arrow_int@3x.png"/>
        </div>
        <div class="courseHome" v-else @click.stop="toCourseDetail">
          课程主页
        </div>
      </div>
      <div v-if="type === '2'">
        <div class="right workCircleRight" @click.stop="toSetting" v-if="type === '2' && ((pageInfo.isMember || pageInfo.isOwner) || (!pageInfo.isMember && pageInfo.isAttention))">
            设置<img class="to_img" src="../../assets/icon/bnt_arrow_int@3x.png"/>
        </div>
        <div class="focus" @click.stop="focus" v-else>
          <i class="icon iconfont icon-add"></i> 关注
        </div>
      </div>
      <div v-if="type === '3' && pageInfo.status !== 1 && pageInfo.isJoin">
        <div class="right live" @click.stop="jumpLive">直播间</div>
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
      type: String,
      default: '1' // 1课程 2工作区 3直播
    },
    pageInfo: {
      type: Object
    }
  },
  data () {
    return {
      courseIntroduction: false
    }
  },
  methods: {
    toSetting () {
      this.$router.push({path: '/setting', query: {id: this.pageInfo.id}})
    },
    jumpLive () {
      if (this.pageInfo.status === 1 && !this.pageInfo.isTutor) {
        this.$toast({
          text: '直播尚未开始，敬请期待！',
          width: '14em'
        })
      } else {
        this.$router.push(`/liveRoom?id=${this.pageInfo.liveId}`)
      }
    },
    focus () {
      putFocusApi(this.pageInfo.id).then(res => {
        this.pageInfo.isAttention = true
        this.$toast({text: '关注成功', type: 'text'})
      })
    },
    // 去课程介绍页
    toIntroduction () {
      this.$router.push({path: '/courseDetail', query: {id: this.pageInfo.id, isCourseIntroduce: true}})
      this.courseIntroduction = false
      this.$emit('toCourseIntroduce')
    },
    toCourseDetail () {
      this.$router.push({path: '/courseDetail', query: {id: this.pageInfo.id}})
      this.courseIntroduction = true
      this.$emit('toCourseDetail')
    },
    /* 去成员列表 */
    toMemberList () {
      if (this.type === '2') {
        this.$router.push({path: '/circleMemberList', query: {id: this.pageInfo.id}})
      } else if (this.type === '3') {
        this.$router.push({path: '/liveMemberList', query: {id: this.pageInfo.liveId}})
      } else {
        if (!this.pageInfo.isJoin && !this.pageInfo.isMaster) return
        this.$router.push({path: '/memberList', query: {id: this.pageInfo.id}})
      }
    }
  },
  created () {
    if (this.$route.query.isCourseIntroduce) {
      this.courseIntroduction = false
    } else {
      this.courseIntroduction = true
    }
  },
  mounted () {}
}
</script>

<style lang="less">
.m-community {
  display: block;
  .cover-container {
    .cover {
      width: 100%;
      height: 90px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .bgColor{
      background: #F2F2F2;
    }
    position: relative;
    height: 90px;
    .header-photo{
      border-radius: 3px;
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
        border-radius: 3px;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border: 0.5px solid #ffffff;
      }
    }
    &.circle{
      height: 101px;
      .cover{
        background-repeat: no-repeat;
        background-size: 100% 100%;
        height: 101px;
      }
      .header-photo{
        box-shadow: none;
        width: 80px;
        height: 80px;
        top: 42px;
        border-radius: 50%;
        >img{
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
      }
    }
    &.live {
      .cover {
        height: 100px;
        background:linear-gradient(180deg,rgba(255,255,255,1) 0%,rgba(248,248,248,1) 100%);
      }
    }
  }
  .circleHeader{
    padding: 0 20px;
    color: #354048;
    font-size: 36px;/*px*/
    font-weight: 700;
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
      font-weight: 700;
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
        font-weight: 300;
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
      font-weight: 500;
      .to_img{
        width: 12px;
        height: 12px;
      }
      &.workCircleRight{
        color: #666666;
      }
      .courseHome{
        color: #4080AD;
      }
      &.live {
        color: #4080AD;
        font-size: 26px;/*px*/
        line-height: 18px;
        font-weight: 300;
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
      font-weight: 700;
      border-radius: 15px;
      >i{
        font-weight: 300;
        font-size: 30px;/*px*/
      }
    }
  }
}
</style>