<template>
  <div class="reader">
    <div class="content" v-if="pageInfo" v-html="pageInfo.content"></div>
    <div class="operArea">
      <div class="item" @click.stop="openCatalog = true"><i class="icon iconfont icon-read_btn_datalog"></i>目录</div>
      <div class="item" @click.stop="paging('prev')" :class="{'hide': sectionIndex <= 0}">上一章</div>
      <div class="item" @click.stop="paging('next')" :class="{'hide': sectionIndex >= catalog.length - 1}">下一章</div>
    </div>
    <Popup v-model="openCatalog" position='left' height="100%" class="popup">
      <div class="catalog">
        <p class="catalogP">目录</p>
        <div class="header">
          <img class="icon" :src="detail.smallUrl" alt="">
          <div class="msg">
            <p class="title">{{detail.title}}</p>
          </div>
        </div>
      </div>
    </Popup>
  </div>
</template>
<script>
import {getContentApi, getCatalogueApi} from '@/api/pages/bookHouse'
import { Popup } from 'vux'
export default {
  components: {
    Popup
  },
  data () {
    return {
      pageInfo: null,
      detail: null,
      bookId: this.$route.query.id,
      sectionId: this.$route.query.sectionId,
      sectionIndex: 0, // 章节序号
      catalog: [],
      openCatalog: false // 打开目录
    }
  },
  methods: {
    getCatalog () {
      getCatalogueApi({bookId: this.bookId}).then(res => {
        this.catalog = res.data.catalogues
        this.detail = res.data.bookDetail
        if (this.sectionId) {
          this.catalog.forEach((item, index) => {
            if (this.sectionId === item.chapterId) {
              this.sectionIndex = index
            }
          })
        }
        this.getDetail()
      })
    },
    getDetail () {
      let data = {
        bookId: this.bookId,
        sectionId: this.catalog[this.sectionIndex].chapterId
      }
      this.sectionId = data.sectionId
      getContentApi(data).then(res => {
        this.pageInfo = res.data
      })
    },
    paging (type) {
      if (type === 'prev') {
        if (this.sectionIndex > 0) {
          this.sectionIndex--
          this.getDetail()
          this.$router.push(`/reader?id=${this.bookId}&sectionId=${this.sectionId}`)
        }
      } else {
        if (this.sectionIndex < this.catalog.length - 1) {
          this.sectionIndex++
          this.getDetail()
          this.$router.push(`/reader?id=${this.bookId}&sectionId=${this.sectionId}`)
        }
      }
    }
  },
  created () {
    this.getCatalog()
  }
}
</script>
<style lang="less">
.reader {
  .content {
    padding: 18px 20px 49px;
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
    font-size: 30px; /*px*/
    font-weight: 300;
    box-shadow: 0px -3px 10px 0px rgba(0,0,0,0.05);
    .item {
      .icon {
        font-size: 50px; /*px*/
        margin-right: 10px;
        vertical-align: middle;
      }
      &.hide {
        opacity: 0;
      }
    }
  }
  .popup {
    .catalog {
      width: 325px;
      height: 100%;
      padding: 0 17px 0 20px;
      box-sizing: border-box;
      background: #fff;
      .catalogP {
        padding: 18px 0 0 20px;
        color: #354048;
        font-size: 32px; /*px*/
        font-weight: 700;
        line-height: 20px;
      }
      .header {
        padding-left: 45px;
        position: relative;
        .icon {
          position: absolute;
          width: 30px;
          height: 42px;
          display: block;
          top: 0;
          left: 0;
        }
      }
    }
  }
}
</style>