<template>
  <div class="bookHouse">
    <div class="tab">
      <span class="item"
        v-for="(item, index) in tabList"
        :key="index"
        :class="{'cur': tabIndex === index}"
        @click.stop="choseTab(index)"
      >
      </span>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tabList: ['我读过的', '书屋'],
      tabIndex: 0
    }
  }
}
</script>
<style lang="less">
</style>