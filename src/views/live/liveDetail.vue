<template>
  <div class="liveDetail">
    <commonHeader
      type='3'
      :pageInfo="pageInfo"
    ></commonHeader>
    <div class="content">
      <div class="head">
        <i class="icon"></i>
        <span class="txt">直播简介</span>
      </div>
      <div class="h5Area" v-html="pageInfo.intro"></div>
    </div>
    <div class="footerBtn" v-if="!isIntroduce">
      <div class="timestatus">
        <p class="txt" v-if="pageInfo.status === 1">直播于{{pageInfo.expectedStartTime * 1000 | date('MMMDo HH:mm')}}开始</p>
        <p class="txt" v-if="pageInfo.status === 2">直播进行中</p>
        <p class="txt" v-if="pageInfo.status === 3">直播已结束</p>
      </div>
      <div class="operBtn">
        <xButton class="btn" v-if="!pageInfo.isJoin && !pageInfo.isTutor" @click.stop.native="joinLive">点击参与直播</xButton>
        <xButton class="btn" v-else @click.stop.native="jumpLive">进入直播间</xButton>
      </div>
    </div>
  </div>
</template>
<script>
import commonHeader from '@c/business/commonHeader'
import { getLiveDetailApi, joinLiveApi } from '@/api/pages/live'
export default {
  components: {
    commonHeader
  },
  data () {
    return {
      pageInfo: {},
      id: ''
    }
  },
  computed: {
    isIntroduce () {
      if (this.$route.query.isIntroduce) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    async getInfo () {
      let data = {
        id: this.id
      }
      let res = await getLiveDetailApi(data)
      this.pageInfo = res.data
    },
    joinLive () {
      joinLiveApi({id: this.id}).then(res => {
        this.pageInfo.isJoin = 1
        this.$toast({
          text: '参与成功',
          type: 'success'
        })
      })
    },
    jumpLive () {
      if (this.pageInfo.status === 1 && !this.pageInfo.isTutor) {
        this.$toast({
          text: '直播尚未开始，敬请期待！',
          width: '14em'
        })
      } else {
        this.$router.push(`/liveRoom?id=${this.id}`)
      }
    }
  },
  created () {
    this.id = this.$route.query.id
    this.getInfo()
  }
}
</script>
<style lang="less" scoped>
  .liveDetail {
    padding-bottom: 49px;
    .content {
      margin-top: 50px;
      padding: 0 20px;
      .head {
        font-size: 0;
        .icon {
          width: 6px;
          height: 20px;
          background: #FFE266;
          margin-right: 9px;
          display: inline-block;
          vertical-align: -3px;
        }
        .txt {
          font-size: 40px; /*px*/
          line-height: 20px;
          font-weight: 700;
          color: #929292;
        }
      }
      .h5Area {
        padding: 14px 0;
        color: #354048;
        font-weight: 300;
        line-height: 22px;
      }
    }
    .footerBtn {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 49px;
      display: flex;
      text-align: center;
      line-height: 49px;
      background: #fff;
      box-shadow: 0px -1px 0px 0px rgba(220,220,220,0.5);
      .timestatus {
        flex: 1;
        color: #929292;
        font-weight: 300;
      }
      .operBtn {
        flex-basis: 150px;
        color: #354048;
        font-weight: 300;
        background: #FFE266;
        &.joined {
          background: #EDEDED;
          color: #BCBCBC;
        }
      }
    }
  }
</style>