<template>
  <div class="bookCard" @click.stop="toDetail">
    <div class="mineBook" v-if="type === 1">
      <img class="cover defaultImg" :src="cardData.middleUrl" alt="">
        <div class="title">{{cardData.title}}</div>
        <div class="progressBox">
          <div class="progress">
            <div class="inner" :style="{'width': cardData.currentReadingPercent}"></div>
          </div>
          <span class="num">{{cardData.currentReadingPercent}}</span>
        </div>
    </div>
    <div class="allBook" v-if="type === 0">
      <img class="cover" :src="cardData.middleUrl" alt="">
      <div class="content">
        <div class="title">{{cardData.title}}</div>
        <div class="msg">{{cardData.wordIntro}}</div>
        <div class="num"><i class="icon iconfont icon-read_icon_browse"></i> {{cardData.readCount}}人</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: Number,
      default: 0 // 0 是书屋的样式 1 是我读过的
    },
    cardData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    toDetail () {
      let id = this.cardData.currentCatalogueId || this.cardData.readInfo.currentCatalogueId
      let isRead = false
      if (this.type === 1) {
        id = this.cardData.currentCatalogueId
        if (parseInt(this.cardData.currentReadingPercent) > 0) {
          isRead = true
        }
      } else {
        id = this.cardData.readInfo.currentCatalogueId
        if (parseInt(this.cardData.readInfo.currentReadingPercent) > 0) {
          isRead = true
        }
      }
      if (isRead) {
        this.$router.push(`/reader?id=${this.cardData.bookId}&sectionId=${id}`)
      } else {
        this.$router.push(`/bookDetail?id=${this.cardData.bookId}`)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.bookCard {
  .mineBook {
    width: 95px;
    .cover {
      width: 95px;
      height: 130px;
      display: block;
      box-shadow:0px 2px 5px 0px rgba(219,219,219,1);
      border-radius: 3px;
    }
    .title {
      margin-top: 8px;
      line-height: 20px;
      font-size: 26px; /*px*/
      font-weight: 300;
      color: #354048;
      height: 40px;
      .setEllipsisLn(2);
    }
    .progressBox {
      margin-top: 6px;
      line-height: 16px;
      font-size: 24px; /*px*/
      font-weight: 300;
      color: #D7AB70;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .progress {
        width: 61px;
        height: 4px;
        border-radius: 3px;
        background: #EDEDED;
        position: relative;
        .inner {
          width: 40%;
          height: 4px;
          border-radius: 3px;
          background: #FFE266;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
    }
  }
  .allBook {
    width: 100%;
    height: 100px;
    padding-left: 85px;
    position: relative;
    box-sizing: border-box;
    .cover {
      width: 70px;
      height: 100px;
      border-radius: 3px;
      position: absolute;
      top: 0;
      left: 0;
    }
    .content {
      width: 100%;
      .title {
        padding-top: 5px;
        font-size: 30px; /*px*/
        line-height: 20px;
        font-weight: 700;
        color: #354048;
        .setEllipsisLn(1);
      }
      .msg {
        font-size: 28px; /*px*/
        font-weight: 300;
        line-height: 21px;
        color: #929292;
        margin-top: 5px;
        height: 42px;
        .setEllipsisLn(2);
      }
      .num {
        margin-top: 10px;
        font-size: 24px; /*px*/
        font-weight: 300;
        line-height: 20px;
        .icon {
          vertical-align: sub;
          font-size: 40px; /*px*/
          color: #BCBCBC;
        }
      }
    }
  }
}
</style>