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
  </div>
</template>
<script>
import {getMessageListApi} from '@/api/pages/center'
import messageItem from '@c/business/messageItem'
export default {
  components: {
    messageItem
  },
  data () {
    return {
      list: null
    }
  },
  methods: {
    getList () {
      getMessageListApi().then(res => {
        this.list = res.data
      })
    }
  },
  created () {
    this.getList()
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
    font-weight: 500;
  }
}
</style>