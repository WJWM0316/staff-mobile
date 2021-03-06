<template>
  <div class="infoCard"  @click="toDeatil(item.id || item.liveId)" :class="{'newCouse': item.isNew, 'recommend': recommend}">
    <img v-if="item.isTop" class="setTop" src="@/assets/icon/settop.png" />
    <img class="infoPhoto" v-if="item.coverImg" v-lazyload :src="item.coverImg.smallUrl"/>
    <img class="infoPhoto" v-if="item.courseCoverImg" v-lazyload :src="item.courseCoverImg.smallUrl"/>
    <div class="right" :class="{'special-right' : isList}">
      <div class="title"
        :class="{'ellipsis1' : type === '3' || (type === '1' && !ellipsis2), 'ellipsis2' : type === '2' || (type === '1' && ellipsis2)}">
        {{item.name || item.title}}
      </div>
      <template v-if="!item.userTitle || item.userTitle.length === 0">
        <div class="label" :class="{'special' : isList}"><span class="department" v-if="item.groupName" ref="label">{{item.groupName | ellipsis(10)}}</span><span class="name" v-if="item.realname" :style="maxWidth">{{item.realname}}</span></div>
      </template>
      <template v-else>
        <div class="label userTitle" v-if="item.userTitle.length > 0" :class="{'special-userTitle' : isList}">{{item.realname}} | {{item.userTitle[0].title}}</div>
      </template>
      <div class="progress" v-if="type === '1' && item.isJoin && needProgress">
        <p class="txt" v-if="item.progress === 0">本课程还未学习</p>
        <p class="txt" v-if="item.progress > 0 && item.progress !== 100">已学习 <span class="num">{{item.progress}}%</span></p>
        <p class="txt" v-if="item.progress === 100">本课程已学完</p>
        <div class="progressBar"><div class="inner" :style="{width: item.progress+'%'}"></div></div>
      </div>
      <div class="other" v-if="type === '3'">
        <span class="time">{{item.expectedStartTime * 1000 | date('MM-DD HH:mm')}}</span>
        <span class="status notPlay" v-if="item.status === 1">即将开始</span>
        <span class="status playing" v-if="item.status === 2">正在直播</span>
        <span class="status played" v-if="item.status === 3">查看回顾</span>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    item: {
      type: Object
    },
    type: { // 1是课程 2是工作圈 3是直播
      type: String,
      default: '1'
    },
    needProgress: { // 需要进度条
      type: Boolean,
      default: true
    },
    ellipsis2: { // title两行缩略
      type: Boolean,
      default: false
    },
    recommend: { // 是否是首页的推荐
      type: Boolean,
      default: false
    },
    isList: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      maxWidth: 0 // 计算name的最大宽度
    }
  },
  watch: {
    item () {}
  },
  computed: {},
  methods: {
    toDeatil (id) {
      if (this.type === '1') {
        this.$router.push({path: '/courseDetail', query: {id: id}})
      } else if (this.type === '2') {
        this.$router.push({path: '/circleDetail', query: {id: id}})
      } else {
        if (this.item.status !== 1 && (this.item.isJoin || this.item.isTutor)) {
          this.$router.push({path: '/liveRoom', query: {id: id}})
        } else {
          this.$router.push({path: '/liveDetail', query: {id: id}})
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.$refs.label) {
        this.maxWidth = `max-width: calc(100% - ${this.$refs.label.clientWidth}px)`
      }
    })
  }
}
</script>

<style lang="less" scoped>
.infoCard{
  box-sizing: border-box;
  width:100%;
  padding: 15px 20px 15px 100px;
  position: relative;
  .setTop{
    width: 20px;
    height: 20px;
    position: absolute;
    top: 15px;
    left: 20px;
    z-index: 3;
  }
  .newTitle{
    line-height: ;
    position: absolute;
    top: 15px;
    left: 28px;
    width: 15px;
    height: 30px;
    background-color: #FA6A30;
    z-index: 2;
    color: #FFFFFF;
    font-size: 22px;/*px*/
  }
  &.newCouse::after {
    width: 18px;
    height: 30px;
    content: '新课';
    display: block;
    background: url('../../assets/icon/newLabel.png') center center;
    background-size: 100% 100%;
    text-align: center;
    position: absolute;
    top: 15px;
    left: 25px;
    font-size: 20px; /*px*/
    font-weight: 300;
    color: #fff;
    line-height: 14px;
    display: flex;
    align-items: center;
    white-space: normal;
  }
  .infoPhoto{
    display: block;
    width: 80px;
    height: 80px;
    border-radius: 3px;
    box-shadow:0px 2px 8px 0px rgba(0,0,0,0.14);
    position: absolute;
    top: 15px;
    left: 20px;
  }
  .right{
    box-sizing: border-box;
    height: 80px;
    padding-left: 15px;
    .title{
      color: #354048;
      font-size: 30px;/*px*/
      line-height: 21px;
      &.ellipsis1 {
        .setEllipsis()
      }
      &.ellipsis2 {
        .setEllipsisLn(2)
      }
    }
    .introduction{
      color: #929292;
      font-size: 24px;/*px*/
      font-weight: 300;
      line-height: 16px;
      margin: 4px 0 16px;
    }
    /*人物标签*/
    .label{
      font-size: 24px;/*px*/
      font-weight: 300;
      line-height: 16px;
      margin: 5px 0 0px;
      white-space: initial;
      display: flex;
      & > span {
        vertical-align: top;
      }
      &.userTitle {
        font-size: 24px;/*px*/
        font-weight: 300;
        line-height: 16px;
        color: #929292;
      }
      .department{
        // max-width: 80px;
        text-align: center;
        display: inline-block;
        padding: 0 4px;
        height: 17px;
        line-height: 17px;
        background-color: #354048;
        color: #FFFFFF;
        // .setEllipsis();
      }
      .name{
        white-space: nowrap;
        padding: 0 4px;
        text-align: center;
        display: inline-block;
        height: 17px;
        line-height: 17px;
        background-color: rgba(255,226,102,0.25);
        color: #D7AB70;
      }
    }
    .special-userTitle{
      margin-top: 11px;
    }
    .special{
      margin-top: 10px;
    }
    .progress {
      .txt {
        font-size: 24px; /*px*/
        font-weight: 300px;
        color: #929292;
        line-height: 16px;
        margin: 14px 0 4px;
        .num {
          color: #D7AB70;
          font-weight: 700;
        }
      }
      .progressBar {
        width: 100%;
        height: 4px;
        background: #f8f8f8;
        border-radius: 3px;
        overflow: hidden;
        box-sizing: border-box;
        .inner {
          height: 4px;
          background: #FFEB98;
          border-radius: 3px;
        }
      }
    }
    /*时间和直播状态*/
    .other{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 24px;/*px*/
      font-weight: 300;
      line-height: 16px;
      margin-top: 15px;
      .time{
        color: #929292;
      }
      .status{
        &.played {
          color: #BCBCBC;
        }
        &.notPlay, &.playing {
          color: #D7AB70;
        }
      }
    }
  }
  .special-right{
    padding-top: 3px;
  }
  &.recommend {
    padding-left: 108px;
    .infoPhoto {
      width: 89px;
      height: 89px;
    }
    .right {
      height: 89px;
      .title {
        margin-top: 5px;
      }
      .label {
         margin: 15px 0 0px;
         .department {
          max-width: 68px;
          .setEllipsis(auto);
         }
         .name {
          .setEllipsis(auto);
         }
      }
    }
  }
}
</style>