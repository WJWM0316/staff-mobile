<template>
  <div class="wrap">
  <!--     <p>12121222222</p>
      <p>12121222222</p>
      <p>12121222222</p>
      <p>12121222222</p> -->
    <scroller class="scroller"
      ref="scroller"
      :pullup=true
      :pulldown=true
      :noData="noData"
      :list="listData"
      @pullingUp="pullingUp"
      @pullingDown="pullingDown"
      >
      <ul>
        <li v-for="(item, index) in listData" :key="index"  @click.stop="tap(index)">{{item}}</li>
      </ul>
    </scroller>
  </div>
</template>
<script>
import scroller from '@/components/layout/scroller'
export default {
  components: {
    'scroller': scroller
  },
  data () {
    return {
      noData: false,
      listData: [
        '阿萨德',
        '按时',
        323,
        4,
        '阿萨德',
        '萨达',
        2,
        3,
        4,
        5,
        1,
        '阿萨德',
        3,
        4,
        5,
        1,
        2,
        3,
        5,
        1,
        2,
        3,
        4,
        5,
        1,
        2,
        3,
        5,
        1,
        2,
        3,
        5,
        1,
        2,
        3,
        3
      ]
    }
  },
  computed: {
    scrollbarObj: function () {
      return this.scrollbar ? {fade: this.scrollbarFade} : false
    },
    pullDownRefreshObj: function () {
      return this.pullDownRefresh ? {
        threshold: parseInt(this.pullDownRefreshThreshold),
        stop: parseInt(this.pullDownRefreshStop)
      } : false
    },
    pullUpLoadObj: function () {
      return this.pullUpLoad ? {
        threshold: parseInt(this.pullUpLoadThreshold),
        txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
      } : false
    }
  },
  methods: {
    tap (index) {
      console.log(index)
    },
    pullingUp (scroller) {
      setTimeout(() => {
        if (this.listData.length > 100) {
          this.noData = true
          return
        }
        let a = ['新增的数据', '新增的数据', '新增的数据', '新增的数据', '新增的数据', '新增的数据', '新增的数据', '新增的数据', '新增的数据', '新增的数据', '新增的数据', '新增的数据', '新增的数据', '新增的数据', '新增的数据']
        this.listData = this.listData.concat(a)
      }, 1000)
    },
    pullingDown () {
      setTimeout(() => {
        this.$refs.scroller.pulldownUi = false
      }, 2000)
    }
  }
}
</script>
<style lang="less">
  @import url("../../styles/mixins.less");
  .wrap {
    font-size: 30px; /*px*/
    width: 100%;
  }
  .img {
    width: 150px; /*px*/
    height: 100px;
  }
  .scroller {
    width: 100%;
    height: 50vh;
  }
</style>