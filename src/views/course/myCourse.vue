<template>
  <div class="myCourse">
    <div class="list">
      <info-card v-for="item in list" :item="item" :showIntroduction="false" :origin="true" :key="item.id"></info-card>
    </div>
    <pullUpUi :noData="noData" :list="list" :pullUpStatus="pullUpStatus" @pullUp="pullUp"></pullUpUi>
  </div>
</template>
<script>
import infoCard from '@c/business/infoCard.vue'
import {myCourseListApi} from '@/api/pages/course'
export default {
  components: {
    infoCard
  },
  data () {
    return {
      list: [],
      page: 0,
      noData: false,
      pullUpStatus: false
    }
  },
  methods: {
    pullUp () {
      this.pullUpStatus = true
      this.getList(false).then(res => {
        this.pullUpStatus = false
      })
    },
    getList (needLoading) {
      return new Promise((resolve, reject) => {
        this.page++
        let data = {
          page: this.page
        }
        myCourseListApi(data, needLoading).then(res => {
          this.list = this.list.concat(res.data)
          if (res.meta.currentPage === res.meta.lastPage) {
            this.noData = true
          }
          resolve(res)
        })
      })
    }
  },
  created () {
    this.getList(false)
  }
}
</script>
<style lang="less"></style>