<template>
  <div class="live">
    <div class='tab border-bottom-1px'>
      <span
        class='tabItem'
        v-for='(item, index) in tabList'
        :key='index'
        :class="{'selected': tabIndex === index}"
        @click.stop='tabIndex = index'
      >{{item}}</span>
    </div>
    <div class="main">
      <div class="joined">
        <div class="list">
          <infoCard type="3" v-for="(item, index) in joined.list" :key="index" :item="item"></infoCard>
        </div>
        <pullUpUi :noData="joined.noData" :pullUpStatus="joined.pullUpStatus" @pullUp="pullUp"></pullUpUi>
      </div>
    </div>
  </div>
</template>
<script>
import infoCard from '@c/business/infoCard.vue'
import { getJoinListApi } from '@/api/pages/live'
export default {
  components: {
    infoCard
  },
  data () {
    return {
      tabIndex: 0,
      tabList: ['我参与的直播', '所有直播'],
      joined: {
        list: [],
        noData: false,
        pullUpStatus: false
      },
      all: {
        list: []
      }
    }
  },
  methods: {
    pullUp () {},
    getJoinList ({page, count}, needLoading) {
      let data = {
        page: page || 1,
        count: 7
      }
      getJoinListApi(data, needLoading).then(res => {
        this.joined.list = this.joined.list.concat(res.data || [])
        if (res.data.length === 0) {
          this.joined.noData = true
        }
      })
    }
  },
  created () {
    this.getJoinList({page: 1})
  }
}
</script>
<style lang="less">
  .live {
    padding-top: 44px;
    .tab {
      width: 100%;
      height: 44px;
      text-align: center;
      position: fixed;
      top: 0;
      left: 0;
      background: #fff;
      box-shadow:0px 3px 5px 0px rgba(248,248,248,1);
      .tabItem {
        line-height: 44px;
        font-size: 32px; /*px*/
        font-weight: 300;
        color: #929292;
        display: inline-block;
        margin: 0 14px;
        &.selected {
          color: #354048;
          font-weight: 600;
          position: relative;
          &::after {
            content: '';
            width: 25px;
            height: 3px;
            background: #FFE266;
            position: absolute;
            left: 50%;
            margin-left: -18.5px;
            bottom: 0;
          }
        }
      }
    }
  }
</style>