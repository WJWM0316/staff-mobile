// 分页列表公用mixin
export default {
  data () {
    return {
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        end: false,
        busy: false
      }
    }
  },

  computed: {
    // 是否是最后一页
    isLastPage () {
      return this.pagination.page >= Math.ceil(this.pagination.total / this.pagination.pageSize)
    }
  }
}
