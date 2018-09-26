<template>
  <div class="infoCard"  @click="toWorkCircleDetail(item.id)">
    <img class="infoPhoto" :src="item.coverImg.url || item.coverImg" />
    <div class="right">
      <div class="title">{{item.name || item.title}}</div>
      <div class="introduction" v-if="showIntroduction">课程介绍可以加这个字段吗？</div>
      <div class="label"><span class="department">{{item.groupName}}</span><span class="name">{{item.realname}}</span></div>
      <div class="other" v-if="showOther">
        <span class="time">{{time}}</span>
        <span class="status">正在直播</span>
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
    showIntroduction: {
      type: Boolean,
      default: true
    },
    showOther: {
      type: Boolean,
      default: false
    },
    /* 默认跳转课程详情 */
    origin: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    time () {
      return moment().format('MM-DD HH:mm')
    }
  },
  methods: {
    toWorkCircleDetail (id) {
      console.log(id)
      if (this.origin) {
        console.log(' 去课程详情 ')
        if (this.item.isMaster || this.item.userRole.isJoin === 1) {
          this.$router.push({path: '/course/community', query: {id: id}})
        } else {
          this.$router.push({path: '/course/introduce', query: {id: id}})
        }
      } else {
        console.log(' 我是去工作圈详情 ')
        this.$router.push({path: '/workCircle/circleDetail', query: {id: id}})
      }
    }
  },
  created () {}
}
</script>

<style lang="less" scoped>
.infoCard{
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width:100%;
  padding: 15px 20px;
  .infoPhoto{
    display: block;
    width: 80px;
    height: 80px;
    border-radius: 3px;
    box-shadow: 0px 7px 10px 0px rgba(0,0,0,0.18);
    margin-right: 15px;
  }
  .right{
    padding-top: 4px;
    box-sizing: border-box;
    width: 100%;
    height: 80px;
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
        max-width: 142.5px;
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
        max-width: 93.5px;
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
        color: #BCBCBC;
      }
    }
  }
}
</style>