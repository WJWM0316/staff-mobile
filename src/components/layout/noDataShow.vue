<template>
  <div class="noDataShow">
    <div class="photo">
      <img src="@a/icon/error_404@3x.png" alt="">
    </div>
    <p class="txt">{{content}}</p>
    <div class="btn" @click.stop="toChose" v-if='content === "还没开始读第一本书~"'>去选书</div>
  </div>
</template>
<script>
export default {
  props: {
    content: {
      type: String,
      default: '暂时还没有内容哦～'
    }
  },
  methods: {
    toChose () {
      this.$router.push('/bookHouse?all=true')
    }
  }
}
</script>
<style lang="less" scoped>
  .noDataShow {
    padding: 50px 0;
    .photo {
      width: 120px;
      height: 120px;
      margin: 0 auto;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .txt {
      font-size: 28px; /*px*/
      margin-top: 15px;
      line-height: 14px;
      text-align: center;
      color: #BCBCBC;
      font-weight: 300;
    }
    .btn {
      width: 170px;
      height: 40px;
      line-height: 40px;
      margin: 14px auto;
      color: #D7AB70;
      font-weight: 300;
      border: 0.5px solid #D7AB70;
      box-sizing: border-box;
      text-align: center;
      border-radius: 50px;
    }
  }
</style>