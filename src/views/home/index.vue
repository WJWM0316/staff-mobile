<template>
  <div class="wrap">
    <div>
      <p v-for="n in 100" :key="n">{{n}}</p>
    </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
  @import url("../../styles/mixins.less");
  .wrap {
    font-size: 30px; /*px*/
    width: 100%;
  }
</style>