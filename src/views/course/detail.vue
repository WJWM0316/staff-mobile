<template>
  <div class="postDetail">
    <div class="header">
      <contentheader :showCommunicate="false"></contentheader>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .postDetail{
  }
</style>

<script>
import contentheader from '@/components/dynamicItem/dynamicItem'
export default {
  name: 'detail',
  components: {
    contentheader
  }
}
</script>