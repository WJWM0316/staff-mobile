<template>
  <div class="lostPage">
    <no-data-box :content="content"></no-data-box>
    <div class="backHome">
      <span class="btn" @click="back">返回首页</span>
    </div>
  </div>
</template>

<script>
import noDataBox from '@c/layout/noDataShow'
export default {
  name: 'lostPage',
  components: {
    noDataBox
  },
  data () {
    return {
      content: '该内容已经消失在宇宙黑洞里了...'
    }
  },
  methods: {
    back () {
      this.$router.push({path: ' /home '})
    }
  }
}
</script>

<style lang="less" scoped="scoped">
  .lostPage{
    width: 100%;
    height: 100vh;
    display: flex;
    align-content: center;
    justify-content: center;
    flex-wrap: wrap;
    .backHome{
      text-align: center;
      width: 100%;
      .btn{
        width: 170px;
        height: 40px;
        border-radius: 22px;
        border: 0.5px solid #D7AB70;
        text-align: center;
        line-height: 40px;
        display: inline-block;
        width: 100px;
        font-size: 30px;/*px*/
        color: #D7AB70;
      }
    }
  }
</style>