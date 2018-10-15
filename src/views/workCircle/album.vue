<template>
  <div class="album">
  <div class="box" v-for="(item, index) in monthList" :key="index">
    <div class="monthTitle" @click.stop="showAlbum(item)">
      <span>{{item.str}}</span>
      <img class="arrow" v-if="nowShowMonth === item.str" src="../../assets/icon/btn_packup_task@3x.png" />
      <img class="arrow" v-else src="../../assets/icon/bnt_arrow_int@3x.png" />
    </div>
    <div class="picBox" v-if="nowShowMonth === item.str">
      <img class="picItem" v-lazyload v-for="(picItem, index) in nowPicList" :key="index" :src="picItem.fileInfo.smallUrl" />
    </div>
    <a href="http://staff-wap.xplus.ziwork.com/tiger/img/2018/1013/10/5bc15f987213f.jpg!130xauto" download>下载</a>
  </div>
  </div>
</template>

<script>
import { getPicturemonthApi, getPictureApi } from '@/api/pages/workCircle'
export default {
  name: 'Album',
  data () {
    return {
      monthList: [],
      nowShowMonth: '',
      nowPage: 1, // 当前翻页的页码
      nowPicList: [] // 当前点击查看的相册列表
    }
  },
  methods: {
    /* 获取有数据的月份列表 */
    async getPicturemonth () {
      let res = await getPicturemonthApi(this.$route.query.id)
      this.monthList = res.data
    },
    init () {
      this.getPicturemonth()
    },
    /* 展开点击月份相册 */
    async showAlbum (item) {
      this.$router.push({path: '/fileDownLoad', query: {item: item.str, month: item.month, id: this.$route.query.id, type: 1}})
    }
  },
  created () {
    this.init()
  }
}
</script>

<style lang="less" scoped>
.album{
  .box{
    width: 100%;
    height: 60px;
    .monthTitle{
      border-bottom: 1px solid #F7F7F7;
      color: #354048;
      height: 100%;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .arrow{
        width: 15px;
        height: 15px;
      }
    }
  }
}
</style>