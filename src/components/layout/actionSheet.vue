<template>
  <div class="actionsheet">
    <actionsheet
      v-model="isShow"
      show-cancel
      :menus="menus"
      @on-click-mask="clickMask"
      @on-click-menu="choseResult"
    ></actionsheet>
  </div>
</template>
<script>
import { Actionsheet } from 'vux'
export default {
  components: {
    Actionsheet
  },
  props: {
    showSheet: {
      type: Boolean,
      default: false
    },
    menus: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    showSheet (val) {
      this.isShow = val
    }
  },
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    clickMask () {
      this.$emit('clickMask')
    },
    choseResult (menuKey, menuItem) {
      this.$emit('choseResult', menuKey, menuItem)
    }
  }
}
</script>
<style lang="less"></style>