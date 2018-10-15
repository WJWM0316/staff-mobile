<template>
  <div class="search">
    <search
      @on-change="getResult"
      v-model="value"
      position="absolute"
      auto-scroll-to-top
      @on-cancel="onCancel"
      ref="search">
        <div class="list">
          <div class="item border-bottom-1px" :class="{'hasFile': item.type !== '无文件'}" v-for="(item, index) in this.results" :key="index" @click.stop="resultClick(item.id)">
            <div class="photo" v-if="item.type !== '无文件'">
              <img v-if="item.type === '图片'" :src="item.accessory[0].smallUrl">
              <img v-if="item.type === '文件'" :src="item.accessory[0].attachType | fileCover">
              <img v-if="item.type === '链接'" src="@a/icon/postLink.png">
            </div>
            <div class="content">
              <p class="title">{{item.cardContent}}</p>
              <p class="msg">{{item.releaseUser.realname}} {{item.releaseUser.createdAt}}</p>
            </div>
          </div>
       </div>
      </search>
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
  computed: {
  },
  methods: {
    resultClick (id) {
      this.$router.push(`/postDetail?id=${id}`)
    },
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
<style lang="less" scoped>
.search {
  .list {
    padding: 10px 0 0 20px;
    .item {
      padding: 15px 20px 15px 0;
      .title {
        font-size: 32px; /*px*/
        line-height: 20px;
        font-weight: 400;
        color: #354048;
      }
      .msg {
        color: #BCBCBC;
        font-size: 24px; /*px*/
        line-height: 16px;
        font-weight: 400;
        margin-top: 5px;
      }
      &.hasFile {
        padding-left: 52px;
        position: relative;
        .photo {
          width: 44px;
          height: 44px;
          display: block;
          position: absolute;
          top: 15px;
          left: 0;
          img {
            width: 100%;
            height: 100%;
            display: block;
          }
        }
      }
    }
  }
}
</style>