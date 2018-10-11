<template>
  <div class="infoCard"  @click="toDeatil(item.id || item.liveId)">
    <img class="infoPhoto" v-if="item.coverImg" v-lazyload :src="item.coverImg.smallUrl"/>
    <img class="infoPhoto" v-if="item.courseCoverImg" v-lazyload :src="item.courseCoverImg.smallUrl"/>
    <div class="right">
      <div class="title">{{item.name || item.title}}</div>
      <div class="label"><span class="department" v-if="item.groupName">{{item.groupName}}</span><span class="name" v-if="item.realname">{{item.realname}}</span></div>
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
  name: 'infoCard',
  props: {
    item: {
      type: Object
    },
    type: { // 1是课程 2是工作圈 3是直播
      type: String,
      default: '1'
    }
  },
  watch: {
    item () {}
  },
  computed: {
    newCouse () {
      if (this.type === 1 && new Date().getTime() - new Date(this.item.createdAt).getTime() > 7 * 24 * 3600 * 1000) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    toDeatil (id) {
      if (this.type === '1') {
        this.$router.push({path: '/courseDetail', query: {id: id}})
      } else if (this.type === '2') {
        this.$router.push({path: '/circleDetail', query: {id: id}})
      } else {
        this.$router.push({path: '/liveDetail', query: {id: id}})
      }
    }
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
.infoCard{
  box-sizing: border-box;
  width:100%;
  padding: 15px 20px 15px 100px;
  position: relative;
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
      line-height: 20px;
      font-weight: 400;
      overflow:hidden;
      text-overflow:ellipsis;
      display:-webkit-box;
      -webkit-box-orient:vertical;
      -webkit-line-clamp:2;
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
      font-weight: 400;
      line-height: 16px;
      margin: 11px 0 16px;
      .department{
        max-width: 135px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        padding: 0 4px;
        text-align: center;
        display: inline-block;
        height: 17px;
        background-color: #354048;
        color: #FFFFFF;
      }
      .name{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        padding: 0 4px;
        text-align: center;
        display: inline-block;
        max-width: 90px;
        height: 17px;
        background-color: rgba(255,226,102,0.25);
        color: #D7AB70;
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
}
</style>