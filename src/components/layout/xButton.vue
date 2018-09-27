<template>
  <button
    class="btn"
    :class="[{
      'main_default': type === 'main' && !active && !disabled,
      'main_active': type === 'main' && active && !disabled,
      'main_disabled': type === 'main' && disabled,
      'normal_default': type === 'normal' && !active && !disabled,
      'normal_active': type === 'normal' && active && !disabled,
      'normal_disabled': type === 'normal' && disabled
    }]"
    :disabled="disabled"
    @touchstart="active = true"
    @touchend="active = false"
  >
    <slot></slot>
  </button>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: 'main'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      active: false
    }
  }
}
</script>
<style lang="less" scoped>
.btn {
  width: 100%;
  text-align: center;
  border: none;
  font-weight:400;
  overflow: hidden;
  &.main_default {
    background: #FFE266;
    color: #354048;
  }
  &.main_active {
    background: #EBD05E;
    color: rgba(53,64,72,0.5);
  }
  &.main_disabled {
    background:rgba(255,226,102,0.5);
    color:rgba(53,64,72,0.5);
  }
  &.normal_default {
    background: #fff;
    color: #354048;
    border: 1px solid #D7AB70;
  }
  &.normal_active {
    background:rgba(248,248,248,1);
    color: #354048;
    border: 1px solid #D7AB70;
  }
  &.normal_disabled {
    background: #929292;
    color: #BCBCBC;
    border: 1px solid #929292;
  }
}
</style>