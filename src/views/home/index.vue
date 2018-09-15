<template>
  <div class="wrap">
    <div>
      <p v-for="n in list" :key="n" class="txt">{{n}}</p>
    </div>
  </div>
</template>
<script>
import { userInfoApi } from '@/api/pages/center'
import { mapState, mapActions } from 'vuex'
export default {
  components: {
  },
  data () {
    return {
      list: 50
    }
  },
  watch: {
    pullUpStatus (val) {
      console.log('机制')
      setTimeout(() => {
        this.list = this.list + 10
        this.updata_pullUpStatus(false)
      }, 2000)
      // this.getUserInfo().then(res => {
      // })
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.global.userInfo,
      pullUpStatus: state => state.global.pullUpStatus,
      pullDownStatus: state => state.global.pullDownStatus
    })
  },
  methods: {
    ...mapActions([
      'updata_userInfo',
      'updata_pullUpStatus',
      'updata_pullDownStatus'
    ]),
    init () {
      return this.getUserInfo()
    },
    getUserInfo () {
      return userInfoApi('', false)
    }
  },
  mounted () {
    this.$root.$children[0]._loadMore = () => {
      return this.init().then(res => {
        return res
      })
    }
  }
}
</script>
<style lang="less" scoped>
  @import url("../../styles/mixins.less");
  .wrap {
    font-size: 30px; /*px*/
    width: 100%;
    .txt {
      font-size: 24px;  /*px*/
    }
  }
</style>