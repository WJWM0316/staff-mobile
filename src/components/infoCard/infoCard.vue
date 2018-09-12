<template>
  <div class="infoCard"  @click="toWorkCircleDetail">
    <img class="infoPhoto" src="../../assets/icon/asda.jpg" />
    <div class="right">
      <div class="title">创业路上，每一个想法都是一个创业路上，每一个想法都是一个创业路上，每一个想法都是一个</div>
      <div class="introduction" v-if="showIntroduction">课程介绍可以加这个字段吗？</div>
      <div class="label"><span class="department">技术部</span><span class="name">浩彬</span></div>
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
    showIntroduction: {
      type: Boolean,
      default: true
    },
    showOther: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    time () {
      return moment().format('MM-DD HH:mm')
    }
  },
  methods: {
    toWorkCircleDetail () {
      console.log(' 我是去工作圈详情 ')
    }
  }
}
</script>

<style lang="less" scoped>
.infoCard{
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width:100%;
  padding: 30px 40px;
  .infoPhoto{
    display: block;
    width: 160px;
    height: 160px;
    border-radius: 6px;
    box-shadow: 0px 14px 20px 0px rgba(0,0,0,0.18);
    margin-right: 30px;
  }
  .right{
    padding-top: 8px;
    box-sizing: border-box;
    width: 100%;
    height: 160px;
    .title{
      color: #354048;
      font-size: 30px;/*px*/
      line-height: 40px;
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
      line-height: 32px;
      margin: 8px 0 32px;
    }
    /*人物标签*/
    .label{
      font-size: 24px;/*px*/
      font-weight: 400;
      line-height: 32px;
      margin: 21px 0 32px;
      .department{
        max-width: 285px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        padding: 0 8px;
        text-align: center;
        display: inline-block;
        height: 34px;
        background-color: #354048;
        color: #FFFFFF;
      }
      .name{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        padding: 0 8px;
        text-align: center;
        display: inline-block;
        max-width: 187px;
        height: 34px;
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
      line-height: 32px;
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