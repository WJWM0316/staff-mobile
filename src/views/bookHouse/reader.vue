<template>
  <div class="reader">
    <div class="content" id="content" ref="richText" v-if="pageInfo" v-html="pageInfo.content"></div>
    <div class="operArea" :class="{'floor': showOper}">
      <div class="item" @click.stop="openCatalog = true"><i class="icon iconfont icon-menu"></i>目录</div>
      <div class="item" @click.stop="paging('prev')" :class="{'hide': sectionIndex <= 0}">上一节</div>
      <div class="item" @click.stop="paging('next')" :class="{'hide': sectionIndex >= idList.length - 1}">下一节</div>
    </div>
    <Popup v-model="openCatalog" position='left' height="100%" class="popup" v-if="detail">
      <p class="catalogP">目录</p>
      <div class="catalog">
        <div class="header border-bottom-1px" @click.stop="toDetail">
          <img class="icon" :src="detail.smallUrl" alt="">
          <div class="msg">
            <p class="title">{{detail.title}}</p>
            <i class="back iconfont icon-me_icon_edit_chevron"></i>
          </div>
        </div>
        <div class="list">
          <div class="catalogItem" v-for="(n, index) in catalog" :key="index">
            <p class="title border-bottom-1px"  :class="{'cur': sectionId === n.chapterId}"  @click.stop="jump(n.chapterId)">{{n.chapterName}}</p>
            <p class="sectionItem border-bottom-1px" v-if="n.catalogueSections.length > 0" v-for="(i, index) in n.catalogueSections" :key="index" :class="{'cur': sectionId === i.sectionId}"  @click.stop="jump(i.sectionId)">{{i.sectionName}}</p>
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
      idList: [], // 章节id列表
      openCatalog: false, // 打开目录
      showOper: true, // 操作栏
      position: 0, // 记录浏览位置
      wrap: null // 容器
    }
  },
  methods: {
    getCatalog () {
      getCatalogueApi({bookId: this.bookId}).then(res => {
        this.catalog = res.data.catalogues
        this.detail = res.data.bookDetail
        this.catalog.forEach((item, index) => {
          if (item.catalogueSections.length > 0) {
            item.catalogueSections.forEach((item1, index1) => {
              this.idList.push(item1.sectionId)
            })
          } else {
            this.idList.push(item.chapterId)
          }
        })
        if (this.sectionId) {
          this.idList.forEach((itme2, index2) => {
            if (this.sectionId === itme2) {
              this.sectionIndex = index2
            }
          })
        }
        this.getDetail()
      })
    },
    getDetail (id, needloading) {
      return new Promise((resolve, reject) => {
        let data = {
          bookId: this.bookId,
          sectionId: id || this.idList[this.sectionIndex],
          position: this.position
        }
        this.sectionId = data.sectionId
        getContentApi(data, needloading).then(res => {
          this.pageInfo = res.data
          resolve(res)
          this.$nextTick(() => {
            window.scrollTo(0, this.pageInfo.position)
          })
        })
      })
    },
    jump (id) {
      this.sectionId = id
      this.getDetail(id)
      this.openCatalog = false
      if (this.sectionId) {
        this.idList.forEach((itme2, index2) => {
          if (this.sectionId === itme2) {
            this.sectionIndex = index2
          }
        })
      }
      this.$router.replace(`/reader?id=${this.bookId}&sectionId=${id}`)
    },
    paging (type) {
      if (type === 'prev') {
        if (this.sectionIndex > 0) {
          this.sectionIndex--
          this.getDetail()
          this.$router.replace(`/reader?id=${this.bookId}&sectionId=${this.sectionId}`)
        }
      } else {
        if (this.sectionIndex < this.idList.length - 1) {
          this.sectionIndex++
          this.getDetail()
          this.$router.replace(`/reader?id=${this.bookId}&sectionId=${this.sectionId}`)
        }
      }
    },
    toDetail () {
      this.$router.push(`/bookDetail?id=${this.bookId}`)
    }
  },
  created () {
    this.getCatalog()
    let lastY = 0
    window.onscroll = (e) => {
      this.position = window.scrollY
      console.log(window.scrollY)
      if (window.scrollY < lastY) {
        if (!this.showOper) {
          this.showOper = true
        }
      } else {
        this.showOper = false
      }
      if (window.scrollY === 0) {
        this.showOper = true
      }
      lastY = window.scrollY
    }
  },
  beforeRouteLeave (to, from, next) {
    this.getDetail().then(res => {
      next(true)
    })
  }
}
</script>
<style lang="less">
.reader {
  position: relative;
  .content {
    padding: 18px 20px 59px;
    font-size: 32px; /*px*/
    line-height: 1.9;
    color: #354048;
    min-height: 100vh;
    box-sizing: border-box;
    h1, h2, h3, h4, h5, h6 {
      font-size: 36px; /*px*/
      line-height: 1.4;
      margin-bottom: 12px;
    }
    img {
      margin: 10px 0;
    }
  }
  .operArea {
    padding: 0 20px;
    width: 100%;
    height: 49px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    left: 0;
    bottom: 0;
    color: #929292;
    font-size: 30px; /*px*/
    font-weight: 300;
    box-shadow: 0px -3px 10px 0px rgba(0,0,0,0.05);
    background: #fff;
    &.floor {
      position: fixed;
    }
    .item {
      width: 70px;
      text-align: center;
      &:first-child {
        text-align: left;
      }
      &:last-child {
        text-align: right;
      }
      .icon {
        font-size: 44px; /*px*/
        margin-right: 4px;
        vertical-align: middle;
        color: #ACACAC;
      }
      &.hide {
        color: #DCDCDC;
      }
    }
  }
  .popup {
    background: #fff;
    .catalogP {
      padding: 18px 0 0 20px;
      color: #354048;
      font-size: 32px; /*px*/
      font-weight: 700;
      line-height: 20px;
    }
    .catalog {
      width: 325px;
      box-sizing: border-box;
      .header {
        padding: 18px 17px 15px 65px;
        position: relative;
        .icon {
          position: absolute;
          width: 30px;
          height: 42px;
          display: block;
          top: 18px;
          left: 20px;
        }
        .msg {
          font-size: 30px; /*px*/
          font-weight: 300;
          color: #354048;
          height: 42px;
          display: flex;
          align-items: center;
          line-height: 20px;
          justify-content: space-between;
          .title {
            width: 80%;
            .setEllipsisLn(2)
          }
          .back {
            font-size: 24px; /*px*/
            color: rgb(220, 220, 220);
          }
        }
      }
      .list {
        padding: 0 20px;
        .catalogItem {
          width: 100%;
          .title {
            padding: 21px 0;
            color: #354048;
            line-height: 18px;
            font-size: 28px; /*px*/
            &.cur {
              color: #D7AB70;
            }
          }
          .sectionItem {
            padding: 21px 10px;
            color: #666666;
            line-height: 18px;
            font-size: 28px; /*px*/
            font-weight: 300;
            &.cur {
              color: #D7AB70;
            }
          }
        }
      }
    }
  }
}
</style>