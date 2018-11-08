<template>
  <div class="reader">
    <div class="content" v-html="pageInfo.content"></div>
    <div class="operArea">
      <div class="item"><i class="icon iconfont icon-read_btn_datalog"></i>目录</div>
      <div class="item">上一章</div>
      <div class="item">下一章</div>
    </div>
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
    font-size: 30px; /*px*/
    line-height: 1.4;
    font-weight: 300;
    color: #354048;
    h1 {
      font-size: 36px; /*px*/
      line-height: 1.4;
      margin-bottom: 12px;
    }
  }
  .operArea {
    padding: 0 12px 0 20px;
    width: 100%;
    height: 49px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    color: #929292;
    .item {
      .icon {
        font-size: 50px; /*px*/
        margin-right: 10px;
        vertical-align: middle;
      }
    }
  }
}
</style>