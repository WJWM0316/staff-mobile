<template>
  <div class="live">
    <div class='tab border-bottom-1px'>
      <span
        class='tabItem'
        v-for='(item, index) in tabList'
        :key='index'
        :class="{'selected': tabIndex === index}"
        @click.stop='choseTab(index)'
      >{{item}}</span>
    </div>
    <div class="main">
      <div class="joined" v-show="tabIndex === 0">
        <div class="list">
          <infoCard type="3" v-for="item in joined.list" :key='item.liveId+11' :item="item"></infoCard>
        </div>
        <pullUpUi :noData="joined.noData" :pullUpStatus="joined.pullUpStatus" @pullUp="pullUp"></pullUpUi>
        <noDataShow v-if="joined.list.length === 0"></noDataShow>
      </div>
      <div class="all" v-show="tabIndex === 1">
        <div class="list">
          <template v-if="all.list1.length > 0">
            <div class="head">
              <i class="icon"></i>
              <span class="txt">近期直播</span>
            </div>
            <infoCard type="3" v-for="item in all.list1" :key='item.liveId' :item="item"></infoCard>
          </template>
          <template v-if="all.list2.length > 0">
            <div class="head">
              <i class="icon"></i>
              <span class="txt">回顾直播</span>
            </div>
            <infoCard type="3" v-for="item in all.list2" :key='item.liveId' :item="item"></infoCard>
          </template>
        </div>
        <pullUpUi :noData="all.noData" :pullUpStatus="all.pullUpStatus" @pullUp="pullUp"></pullUpUi>
        <noDataShow v-if="all.list1.length === 0 && all.list2.length === 0"></noDataShow>
      </div>
    </div>
  </div>
</template>
<script>
import infoCard from '@c/business/infoCard.vue'
import { getJoinListApi, getRecentListApi, getEndListApi } from '@/api/pages/live'
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
        page: 1,
        noData: false,
        pullUpStatus: false
      },
      all: {
        isLoad: false, // 列表还未加载
        list1: [],
        list2: [],
        recentPage: 1, // 近期直播页数
        endPage: 1, // 结束直播页数
        noData: false,
        pullUpStatus: false
      }
    }
  },
  methods: {
    choseTab (index) {
      this.tabIndex = index
      if (this.tabIndex === 1) {
        this.$router.push('/live?type=all')
        if (!this.all.isLoad && !this.all.noData) {
          this.getRecentList({page: 1}, true)
        }
      } else {
        this.$router.push('/live')
        if (this.joined.list.length === 0 && !this.joined.noData) {
          this.getJoinList({page: 1}, true)
        }
      }
    },
    pullUp () {
      if (this.tabIndex === 0) {
        this.joined.page++
        this.joined.pullUpStatus = true
        this.getJoinList({page: this.joined.page}, false).then(res => {
          this.joined.pullUpStatus = false
        })
      } else {
        if (!this.all.recentComplete) {
          this.all.recentPage++
          this.all.pullUpStatus = true
          this.getRecentList({page: this.all.recentPage}, false).then(res => {
            this.all.pullUpStatus = false
          })
        } else {
          this.all.endPage++
          this.all.pullUpStatus = true
          this.getEndList({page: this.all.endPage}, false).then(res => {
            this.all.pullUpStatus = false
          })
        }
      }
    },
    getJoinList ({page, count}, needLoading) {
      return new Promise((resolve, reject) => {
        let data = {
          page: page || 1,
          count: count || 20
        }
        getJoinListApi(data, needLoading).then(res => {
          this.joined.list = this.joined.list.concat(res.data || [])
          if (res.meta.currentPage === res.meta.lastPage) {
            this.joined.noData = true
          }
          resolve(res)
        })
      })
    },
    getRecentList ({page, count}, needLoading) {
      if (!this.all.isLoad) this.all.isLoad = true // 防止切换tab是重复加载
      return new Promise((resolve, reject) => {
        let data = {
          page: page || 1,
          count: count || 20
        }
        getRecentListApi(data, needLoading).then(res => {
          this.all.list1 = this.all.list1.concat(res.data || [])
          if (res.data.length < 20) {
            this.getEndList({page: 1}, false)
          }
          resolve(res)
        })
      })
    },
    getEndList ({page, count}, needLoading) {
      return new Promise((resolve, reject) => {
        let data = {
          page: page || 1,
          count: count || 20
        }
        getEndListApi(data, needLoading).then(res => {
          this.all.list2 = this.all.list2.concat(res.data || [])
          if (res.meta.currentPage === res.meta.lastPage) {
            this.all.noData = true
          }
          resolve(res)
        })
      })
    },
    init () {
      if (this.$route.query.type) {
        this.tabIndex = 1
        this.getRecentList({page: 1}, true)
      } else {
        this.getJoinList({page: 1}, true)
      }
    }
  },
  watch: {
    '$route' (val) {
      let index = 0
      this.$route.query.type ? index = 1 : index = 0
      this.choseTab(index)
    }
  },
  created () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
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
      z-index: 1;
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
    .head {
      font-size: 0;
      padding: 25px 20px 8px;
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
  }
</style>