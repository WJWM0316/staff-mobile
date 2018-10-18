<template>
  <div class="search">
    <search
      v-model="value"
      position="absolute"
      auto-scroll-to-top
      @on-cancel="onCancel"
      ref="search">
        <div class="list">
          <div class="item border-bottom-1px" :class="{'hasFile': item.type !== '无文件'}" v-for="(item, index) in this.results" :key="index" @click.stop="resultClick(item.id)">
            <div class="photo" v-if="item.type !== '无文件'">
              <img v-if="item.type === '图片'" :src="item.accessory[0].smallUrl">
              <img v-if="item.type === '文件'" :src="item.accessory[0].attachType | fileCover">
              <img v-if="item.type === '链接'" src="@a/icon/postLink.png">
            </div>
            <div class="content">
              <p class="title">{{item.cardContent}}</p>
              <p class="msg">{{item.releaseUser.realname}} {{item.releaseUser.createdAt}}</p>
            </div>
          </div>
       </div>
    </search>
    <div class="history" v-if="!value && showHistory.list.length > 0">
      <div class="title border-bottom-1px">历史搜索<i class="icon"><img @click.stop="remove" src="@a/icon/search_btn_delete@3x.png" alt=""></i></div>
      <div class="historyList">
        <span class="item" v-for="(n, index) in showHistory.list" :key="index" @click.stop="getHistory(n)">{{n}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import {getPostlistApi} from '@/api/pages/workCircle'
import localstorage from '@u/localstorage'
import { Search } from 'vux'
export default {
  components: {
    Search
  },
  data () {
    return {
      value: null,
      id: this.$route.query.id,
      results: null,
      historyList: [
        {
          list: []
        }
      ], // 所有历史记录
      historyIndex: 0, // 当前的历史记录index
      timer: null // 定时器
    }
  },
  computed: {
    showHistory () {
      return this.historyList[this.historyIndex]
    }
  },
  watch: {
    value () {
      this.getResult(300)
    }
  },
  methods: {
    remove () {
      localstorage.remove('historyList')
      this.historyList[this.historyIndex].list = []
    },
    resultClick (id) {
      if (this.value && this.historyList[this.historyIndex].list.indexOf(this.value) === -1) {
        this.historyList[this.historyIndex].list.unshift(this.value)
        if (this.historyList[this.historyIndex].list.length > 6) {
          this.historyList[this.historyIndex].list.pop()
        }
        if (!this.historyList[this.historyIndex].hasOwnProperty('circleId')) {
          this.historyList[this.historyIndex].circleId = this.id
        }
        localstorage.set('historyList', this.historyList)
      }
      this.$router.push(`/postDetail?id=${id}`)
    },
    getHistory (n) {
      this.value = n
      this.$refs.search.setFocus()
    },
    getResult (time) {
      if (!this.value) return
      window.clearTimeout(this.timer)
      this.timer = window.setTimeout(() => {
        let data = {
          id: this.id,
          keyword: this.value
        }
        let res = getPostlistApi(data, false).then(res => {
          this.results = res.data
        })
      }, time)
    },
    onCancel () {}
  },
  created () {
    this.historyList = localstorage.get('historyList') || [{list: []}]
    this.historyList.forEach((item, index) => {
      if (item.circleId === this.id) {
        this.historyIndex = index || 0
      }
    })
  }
}
</script>
<style lang="less" scoped>
.search {
  .list {
    padding: 10px 0 0 20px;
    .item {
      padding: 15px 20px 15px 0;
      .title {
        font-size: 32px; /*px*/
        line-height: 20px;
        font-weight: 300;
        color: #354048;
      }
      .msg {
        color: #BCBCBC;
        font-size: 24px; /*px*/
        line-height: 16px;
        font-weight: 300;
        margin-top: 5px;
      }
      &.hasFile {
        padding-left: 52px;
        position: relative;
        .photo {
          width: 44px;
          height: 44px;
          display: block;
          position: absolute;
          top: 15px;
          left: 0;
          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }
      }
    }
  }
  .history {
    padding: 0 20px;
    .title {
      font-size: 28px; /*px*/
      font-weight: 300;
      color: #354048;
      line-height: 18px;
      padding-top: 23px;
      padding-bottom: 8px;
      .icon {
        width: 16px;
        height: 16px;
        float: right;
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
    }
    .historyList {
      margin: 15px 0 0;
      font-size: 0; /*px*/
      .item {
        padding: 0 15px;
        font-size: 28px; /*px*/
        color: #BCBCBC;
        margin: 0 15px 12px 0;
        background: #F8F8F8;
        line-height: 32px;
        border-radius: 3px;
        display: inline-block;
        max-width: 150px;
        box-sizing: border-box;
        .setEllipsis();
      }
    }
  }
}
</style>