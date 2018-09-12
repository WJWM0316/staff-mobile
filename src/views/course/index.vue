<template>
	<div class="coursePage">
	  <info-card></info-card>
	  <info-card></info-card>
	  <info-card></info-card>
	  <info-card></info-card>
	</div>
</template>

<style lang="less" scoped>
.coursePage{
  font-size: 32px;
}
</style>

<script>
import infoCard from '@/components/infoCard/infoCard.vue'
export default {
  name: 'course',
  components: {
    infoCard
  },
  data () {
    return {
      data: 1
    }
  },
  created () {
    this.pageInt()
  },
  methods: {
    //  初始化方法
    async pageInt () {}
  }
}
</script>
