<template>
  <div class="bookDetail" v-if="pageInfo">
    <div class="header">
      <div class="cover">
        <img class="coverImg" :src="pageInfo.url" alt="">
      </div>
      <backHome></backHome>
      <div class="title">{{pageInfo.title}}</div>
      <div class="msg">{{pageInfo.wordIntro}}</div>
      <div class="members" v-if="pageInfo.readCount">
        <div class="memberInfo">
          <img v-for="(n, index) in pageInfo.memberInfo" :key="index" :src="n.avatarInfo.smallUrl" v-if="index < 4" @click.stop="toPerson(n.id)">
          <img src="@a/icon/firends-call-more.png" v-if="pageInfo.memberInfo.length > 4">
        </div>
        <div class="num"><i class="icon iconfont icon-read_icon_browse1"></i>{{pageInfo.readCount}}人</div>
      </div>
    </div>
    <div class="content" v->
      <div class="title">
        <i class="block"></i>
        <span>书籍简介</span>
      </div>
      <div class="h5" v-preview="'richText'" v-html="removeFontSize(pageInfo.introduce)"></div>
    </div>
    <xButton class="readBtn" @click.native.stop="read">开始阅读</xButton>
  </div>
</template>
<script>
import {getBookInfoApi} from '@/api/pages/bookHouse'
import backHome from '@c/layout/backHome'
export default {
  components: {
    backHome
  },
  data () {
    return {
      pageInfo: null
    }
  },
  computed: {
  },
  methods: {
    toPerson (id) {
      this.$router.push(`/personalPage?uid=${id}`)
    },
    getDetail () {
      getBookInfoApi({bookId: this.$route.query.id}).then(res => {
        this.pageInfo = res.data
      })
    },
    read () {
      if (this.pageInfo.readInfo.currentCatalogueId) {
        this.$router.replace(`/reader?id=${this.$route.query.id}&sectionId=${this.pageInfo.readInfo.currentCatalogueId}`)
      } else {
        this.$router.replace(`/reader?id=${this.$route.query.id}`)
      }
    }
  },
  created () {
    this.getDetail()
  }
}
</script>
<style lang="less">
.bookDetail {
  padding-bottom: 49px;
  .header {
    .cover {
      width: 100%;
      height: 120px;
      background: linear-gradient(180deg,rgba(255,255,255,1) 0%,rgba(248,248,248,1) 100%);
      position: relative;
      .coverImg {
        width: 100px;
        height: 140px;
        border-radius: 3px;
        position: absolute;
        top: 20px;
        left: 50%;
        margin-left: -50px;
        box-shadow: 0px 2px 5px 0px rgba(219,219,219,1);
      }
    }
    .title {
      margin-top: 55px;
      padding: 0 30px;
      font-size: 36px; /*px*/
      font-weight: 700;
      line-height: 23px;
      color: #354049;
      .setEllipsisLn(1);
    }
    .msg {
      margin-top: 8px;
      padding: 0 30px;
      font-size: 28px; /*px*/
      font-weight: 300;
      color: #929292;
      .setEllipsisLn(2);
    }
    .members {
      padding: 12px 20px;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .memberInfo {
        font-size: 0;
        img {
          width: 30px;
          height: 30px;
          border: 1px solid #DBDBDB;
          display: inline-block;
          border-radius: 50%;
          margin-left: -5px;
          &:first-child {
            margin-left: 0;
          }
        }
      }
      .num {
        margin-top: 10px;
        font-size: 24px; /*px*/
        font-weight: 300;
        line-height: 20px;
        color: #BCBCBC;
        .icon {
          margin-right: 5px;
          vertical-align: sub;
          font-size: 40px; /*px*/
          color: #BCBCBC;
        }
      }
    }
  }
  .content {
    margin-top: 35px;
    padding: 0 20px;
    .title {
      .block {
        width: 6px;
        height: 20px;
        display: inline-block;
        margin-right: 9px;
        background: #FFE266;
        vertical-align: sub;
      }
      span {
        font-size: 40px; /*px*/
        line-height: 40px; /*px*/
        color: #929292;
        display: inline-block;
      }
    }
    .h5 {
      margin-top: 10px;
      font-size: 30px !important; /*px*/
      line-height: 1.4;
      font-weight: 300;
    }
  }
  .readBtn {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 49px;
    background: #FFE266;
    line-height: 49px;
    text-align: center;
    font-size: 32px; /*px*/
    line-height: 49px;
    color: #354048;
  }
}
</style>