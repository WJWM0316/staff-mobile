<template>
  <div class="liveDetail">
  </div>
</template>
<script>
import { getLiveDetailApi } from '@/api/pages/live'
export default {
  data () {
    return {
      pageInfo: {},
      roomId: '44'
    }
  },
  methods: {
    async getInfo () {
      let data = {
        id: this.roomId
      }
      this.pageInfo = await getLiveDetailApi(data)
    }
  },
  created () {
    this.getInfo()
  }
}
</script>
<style lang="less" scoped>
  .liveDetail {

  }
</style>