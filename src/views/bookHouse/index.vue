<template>
  <div class="bookHouse">
    <div class="tab">
      <i @click.stop="backBtn" class="backBtn iconfont icon-me_icon_edit_chevron"></i>
      <span class="item"
        v-for="(item, index) in tabList"
        :key="index"
        :class="{'cur': tabIndex === index}"
        @click.stop="choseTab(index)"
      >
      {{item}}
      </span>
    </div>
    <div class="tabBar" v-show="tabIndex === 1">
      <span class="tabItem" v-for="(n, index) in tabBarList" :key="n.id" :class="{'cur': tabBarIndex === index}" @click.stop="toggle(n.id, index)">{{n.tagName}}</span>
    </div>
    <div class="myList" v-show="tabIndex === 0">
      <div class="list">
        <bookCard class="item" v-for="item in myData.list" :key='item.bookId+11' :cardData="item" :type="1"></bookCard>
      </div>
      <pullUpUi v-if="tabIndex === 0" :list="myData.list" :noData="myData.noData" :pullUpStatus="myData.pullUpStatus" @pullUp="pullUp" :key='1'></pullUpUi>
      <noDataShow v-if="myData.list.length === 0" content="还没开始读第一本书~"></noDataShow>
    </div>
    <div class="allList" v-show="tabIndex === 1">
      <div class="list">
        <bookCard class="item border-bottom-1px" v-for="item in allData.list" :key='item.bookId+22' :cardData="item" :type="0"></bookCard>
      </div>
      <pullUpUi v-if="tabIndex === 1" :list="allData.list" :noData="allData.noData" :pullUpStatus="allData.pullUpStatus" @pullUp="pullUp" :key='2'></pullUpUi>
      <noDataShow v-if="allData.list.length === 0"></noDataShow>
    </div>
  </div>
</template>
<script>
import bookCard from '@c/business/bookCard'
import {getBooksListApi, getMyBooksListApi, getTagListApi} from '@/api/pages/bookHouse'
export default {
  components: {
    bookCard
  },
  data () {
    return {
      tabList: ['我读过的', '书屋'],
      tabIndex: 0,
      tabBarIndex: 0,
      tabBarList: [],
      allData: {
        list: [],
        page: 0,
        tabId: null, // 类型id
        noData: false,
        pullUpStatus: false
      },
      myData: {
        list: [],
        page: 0,
        noData: false,
        pullUpStatus: false
      }
    }
  },
  watch: {
    '$route' () {
      this.init()
    }
  },
  methods: {
    choseTab (index) {
      this.tabIndex = index
      if (index === 0) {
        this.$router.replace('/bookHouse')
      } else {
        this.$router.replace('/bookHouse?all=true')
      }
      this.init()
    },
    toggle (id, index) {
      this.allData.page = 0
      this.tabBarIndex = index
      this.tabId = id
      this.allData.list = []
      this.getAllList(true)
    },
    getTagList () {
      getTagListApi().then(res => {
        this.tabBarList = this.tabBarList.concat(res.data.tags)
      })
    },
    backBtn () {
      this.$router.push('/home')
    },
    getAllList (needLoading) {
      return new Promise((resolve, reject) => {
        this.allData.page++
        getBooksListApi({page: this.allData.page, tag_id: this.tabId}, needLoading).then(res => {
          this.allData.list = this.allData.list.concat(res.data)
          if (!res.meta.nextPageUrl) {
            this.allData.noData = true
          }
          resolve(res.data)
        }).catch(e => {
          this.allData.page--
        })
      })
    },
    getMyList (needLoading) {
      return new Promise((resolve, reject) => {
        this.myData.page++
        getMyBooksListApi({page: this.myData.page}, needLoading).then(res => {
          this.myData.list = this.myData.list.concat(res.data)
          if (!res.meta.nextPageUrl) {
            this.myData.noData = true
          }
          resolve(res.data)
        }).catch(e => {
          this.allData.page--
        })
      })
    },
    pullUp () {
      if (this.tabIndex === 0) {
        this.myData.pullUpStatus = true
        this.getMyList().then(res => {
          this.myData.pullUpStatus = false
        })
      } else {
        this.allData.pullUpStatus = true
        this.getAllList(false).then(res => {
          this.allData.pullUpStatus = false
        })
      }
    },
    init () {
      if (this.$route.query.all) {
        this.tabIndex = 1
        if (this.allData.list.length === 0 && !this.allData.noData) {
          this.getTagList()
          this.getAllList(null, true)
        }
      } else {
        this.tabIndex = 0
        if (this.myData.list.length === 0 && !this.myData.noData) {
          this.getMyList(true)
        }
      }
    }
  },
  created () {
    this.init()
  }
}
</script>
<style lang="less">
.bookHouse {
  padding-top: 49px;
  .tab {
    width: 100%;
    height: 49px;
    line-height: 49px;
    padding: 0 122px 0 108px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    font-weight: 300;
    color: #BCBCBC;
    font-size: 34px; /*px*/
    box-shadow:0px 3px 5px 0px rgba(248,248,248,1);
    background: #fff;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    .backBtn {
      font-size: 30px; /*px*/
      position: absolute;
      top: 50%;
      left: 17px;
      transform: translateY(-50%) rotate(180deg);
    }
    .item.cur {
      color: #354048;
      font-weight: 700;
      position: relative;
      display: block;
      &::after {
        content: '';
        width: 25px;
        height: 3px;
        background: #FFE266;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
      }
    }
  }
  .tabBar {
    padding: 0 15px;
    font-size: 28px; /*px*/
    height: 40px;
    white-space: nowrap;
    overflow-x: scroll;
    .tabItem {
      color: #929292;
      font-weight: 300;
      margin-right: 23px;
      line-height: 40px;
      display: inline-block;
      &.cur {
        color: #354048;
        font-weight: 700;
        position: relative;
        &::after {
          content: '';
          width: 15px;
          height: 3px;
          background: #FFE266;
          border-radius: 3px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 0;
        }
      }
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .myList {
    padding: 30px 23px;
    .list {
      overflow: hidden;
      .item {
        float: left;
        margin-right: 22px;
        margin-bottom: 30px;
        &:nth-child(3n) {
          margin-right: 0;
        }
      }
    }
  }
  .allList {
    padding: 10px 20px;
    .list {
      .item {
        padding: 20px 0;
        &:last-child {
          &::after {
            display: none;
          }
        }
      }
    }
    
  }
}
</style>