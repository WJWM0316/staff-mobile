<template>
  <div class="reader">
    <div class="content"></div>
  </div>
</template>
<script>
import {getContentApi, getCatalogueApi} from '@/api/pages/bookHouse'
export default {
  data () {
    return {
      content: null,
      bookId: this.$route.query.id,
      sectionId: this.$route.query.sectionId,
      sectionIndex: 0, // 章节序号
      catalog: []
    }
  },
  methods: {
    getCatalog () {
      getCatalogueApi({bookId: this.bookId}).then(res => {
        this.catalog = res.data.catalogues
        this.catalog.forEach((item, index) => {
          if (this.sectionId === item.chapterId) {
            this.sectionIndex = index
          }
        })
      })
    },
    getDetail () {
      let data = {
        bookId: this.bookId,
        sectionId: this.sectionId
      }
      getContentApi(data).then(res => {
        this.pageInfo = res.data
      })
    },
    readBtn () {}
  },
  created () {
    this.getCatalog()
  }
}
</script>
<style lang="less">
</style>