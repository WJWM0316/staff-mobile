<template>
  <div class="album">
  <div class="box" v-for="(item, index) in monthList" :key="index">
    <div class="monthTitle" @click.stop="showAlbum(item)">
      <span>{{item.str}}</span>
      <img class="arrow" v-if="nowShowMonth === item.str" src="../../assets/icon/btn_packup_task@3x.png" />
      <img class="arrow" v-else src="../../assets/icon/bnt_arrow_int@3x.png" />
    </div>
    <div v-if="nowShowMonth === item.str">我是这个月的盒子</div>
  </div>
  </div>
</template>

<script>
import { getPicturemonthApi } from '@/api/pages/workCircle'
export default {
  name: 'Album',
  data () {
    return {
      monthList: [],
      nowShowMonth: ''
    }
  },
  methods: {
    async getPicturemonth () {
      let res = await getPicturemonthApi(this.$route.query.id)
      this.monthList = res.data
    },
    init () {
      this.getPicturemonth()
    },
    /* 展开点击月份相册 */
    showAlbum (item) {
      this.nowShowMonth = item.str
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