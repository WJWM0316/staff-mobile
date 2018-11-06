<template>
  <div class="reader">
    <div class="content" v-html="pageInfo.content"></div>
  </div>
</template>
<script>
import {getContentApi, getCatalogueApi} from '@/api/pages/bookHouse'
export default {
  data () {
    return {
      pageInfo: null,
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
        if (this.sectionId) {
          this.getDetail()
          this.catalog.forEach((item, index) => {
            if (this.sectionId === item.chapterId) {
              this.sectionIndex = index
            }
          })
        } else {
          this.sectionId = this.catalog[0].chapterId
          this.getDetail()
        }
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
.reader {
  .content {
    padding: 18px 20px;
    font-size: 16px; /*px*/
    font-weight: 300;
    color: #354048;
    line-height: 2;
    h1 {
      font-size: 18px; /*px*/
      line-height: 1;
      margin-bottom: 12px;
    }
  }
}
</style>