<template>
  <div class="search">
    <search
      @on-result-click="resultClick"
      @on-change="getResult"
      :results="results"
      v-model="value"
      position="absolute"
      auto-scroll-to-top
      @on-cancel="onCancel"
      ref="search"></search>
  </div>
</template>
<script>
import {searchApi} from '@/api/pages/workCircle'
import { Search } from 'vux'
export default {
  components: {
    Search
  },
  data () {
    return {
      value: null,
      id: this.$route.query.id,
      results: null
    }
  },
  methods: {
    resultClick () {},
    async getResult () {
      let data = {
        id: this.id,
        keyword: this.value
      }
      let res = await searchApi(data)
      this.results = res.data
    },
    onCancel () {}
  }
}
</script>
<style lang="less">
.search {}
</style>