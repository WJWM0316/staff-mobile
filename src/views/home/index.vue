<template>
  <div class="wrap">
    我是首页
    <img class="img" src="../../assets/icon/asda.jpg" alt="">
    <scroll class="scroll"></scroll>
  </div>
</template>
<style lang="less">
@import url("../../styles/mixins.less");
.wrap {
  font-size: 30px; /*px*/
  display: flex;
}
.img {
  width: 150px; /*px*/
  height: 100px;
}
.scroll {
  width: 100%;
}
</style>
<script>
import scroll from '@/components/basic/scroll'
export default {
  components: {
    'scroll': scroll
  }
}
</script>
