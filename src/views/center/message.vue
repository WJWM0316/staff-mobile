<template>
  <div class="message">
    <div class="title">消息通知</div>
    <div class="list">
      <messageItem
        v-for="(item, index) in list"
        :key="index"
        :item="item"
      ></messageItem>
    </div>
    <pullUpUi v-if="list.length > 0" :noData="noData" :pullUpStatus="pullUpStatus" @pullUp="pullUp"></pullUpUi>
    <noDataShow v-if="list.length === 0"></noDataShow>
  </div>
</template>
<script>
import {getMessageListApi, putRedListApi} from '@/api/pages/center'
import messageItem from '@c/business/messageItem'
export default {
  components: {
    messageItem
  },
  data () {
    return {
      list: [],
      noData: false,
      pullUpStatus: false,
      page: 0
    }
  },
  methods: {
    getList (needLoding) {
      return new Promise((resolve, reject) => {
        this.page++
        let data = {
          page: this.page
        }
        getMessageListApi(data, needLoding).then(res => {
          this.list = this.list.concat(res.data)
          if (res.meta && res.meta.currentPage === res.meta.lastPage) {
            this.noData = true
          }
          this.removeRed()
          resolve(res)
        })
      })
    },
    // 消除红点
    removeRed () {
      putRedListApi().then(res => {
      })
    },
    pullUp () {
      this.pullUpStatus = true
      this.getList().then(res => {
        this.pullUpStatus = false
      })
    }
  },
  created () {
    this.getList(true)
  }
}
</script>
<style lang="less">
.message {
  .title {
    padding: 19px 20px 12px;
    color: #354048;
    font-size: 32px; /*px*/
    line-height: 20px;
    font-weight: 700;
  }
}
</style>