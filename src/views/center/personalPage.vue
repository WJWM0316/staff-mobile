<template>
  <div class="personalPage" v-if="userInfo">
    <div class="head">
      <div class="msg">
        <div class="photo">
          <img :src="userInfo.base.avatar.middleUrl">
        </div>
        <p class="name">{{userInfo.base.realname}}</p>
        <p class="position">{{userInfo.base.groupName}} | {{userInfo.base.occupation}}</p>
      </div>
      <div class="studyMsg">
        <div class="item">
          <p class="result">101</p>
          <p class="txt">学习时长/小时</p>
        </div>
        <div class="item">
          <p class="result">101</p>
          <p class="txt">正在学习课程/个</p>
        </div>
        <div class="item">
          <p class="result">101</p>
          <p class="txt">打卡数/节</p>
        </div>
      </div>
    </div>
    <div class="tab">
      <span class="tabItem"
        v-for="(item, index) in tabList"
        :key="index"
        :class="{'selected': tabIndex === index}"
        @click.stop="choseTab(index)"
      >{{item}}</span>
    </div>
    <div class="joined">
      <div class="course">
        <p class="title border-bottom-1px">课程</p>
        <div class="content">
          <infoCard
            v-for="(item, index) in joinList.course"
            :item="item"
            :key="index"
            type="1"
          ></infoCard>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getUserInfoApi } from '@/api/pages/center'
import infoCard from '@c/business/infoCard.vue'
export default {
  componets: {
    infoCard
  },
  data () {
    return {
      userInfo: {},
      tabIndex: 0,
      tabList: ['Ta加入的', 'Ta的帖子'],
      joinList: [],
      postList: []
    }
  },
  methods: {
    choseTab (index) {
      this.tabIndex = index
    },
    getUserInfo () {
      if (!this.$route.query.id) {
        this.userInfo = this.$store.getters.userInfo
      } else {
        getUserInfoApi({uid: this.$route.query.id}).then(res => {
          this.userInfo = res.data
        })
      }
    },
    getJoinList () {

    }
  },
  created () {
    this.getUserInfo()
  }
}
</script>
<style lang="less" scoped>
.personalPage {
  .head {
    width: 100%;
    padding: 25px 0 40px;
    text-align: center;
    .msg {
      .photo {
        width: 75px;
        height: 75px;
        border-radius: 50%;
        overflow: hidden;
        margin: 0 auto;
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
      .name {
        font-size: 36px; /*px*/
        color: #354048;
        line-height: 22px;
        font-weight: 500;
        margin-top: 10px;
      }
      .position {
        font-size: 28px; /*px*/
        color: #666666;
        line-height: 18px;
        font-weight: 300;
        margin-top: 7px;
      }
    }
    .studyMsg {
      margin-top: 30px;
      display: flex;
      .item {
        flex: 1;
        .result {
          font-size: 58px; /*px*/
          color: #D7AB70;
          line-height: 29px;
          font-weight: 500;
        }
        .txt {
          font-size: 24px; /*px*/
          color: #929292;
          line-height: 12px;
          font-weight: 300;
          margin-top: 8px;
        }
      }
    }
  }
  .tab {
    width: 100%;
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 8%;
    box-sizing: border-box;
    background: #F8F8F8;
    .tabItem {
      flex: 1;
      text-align: center;
      font-size: 32px; /*px*/
      font-weight: 300;
      &.selected {
        color: #354048;
        font-weight: 500;
        position: relative;
        height: 100%;
        line-height: 44px;
        &::after {
          content: '';
          width: 64px;
          height: 3px;
          background: #FFE266;
          position: absolute;
          bottom: 0;
          left: 50%;
          margin-left: -32px;
        }
      }
    }
  }
  .joined {
    .course {
      .title {
        padding: 30px 0 10px 15px;
        color: #929292;
        font-size: 36px; /*px*/
        font-weight: 500;
        line-height: 22px;
      }
      .content {
      }
    }
  }
}
</style>