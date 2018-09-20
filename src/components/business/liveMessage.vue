<template>
  <div class="wrap">

  </div>
</template>
<script>
export default {
  props: {
    messageType: {
      type: String,
      default: 'text'
    },
    messageData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  }
}
</script>
<style lang="less">
  .wrap {
  }
</style>