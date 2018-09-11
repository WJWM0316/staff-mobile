<template>
	<div class="coursePage">
		<contentheader></contentheader>
	</div>
</template>

<style lang="less" scoped>
.coursePage{
  font-size: 32px;
}
</style>

<script>
import contentheader from '@/components/dynamicItem/dynamicItem'
import { getCommunityApi } from '@/api/pages/course'
export default {
  name: 'course',
  components: {
    contentheader
  },
  data () {
    return {
      data: 1
    }
  },
  created () {
    console.log(contentheader)
    this.pageInt()
  },
  methods: {
    //  初始化方法
    pageInt () {}
  }
}
</script>
