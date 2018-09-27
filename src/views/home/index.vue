<template>
  <div class="wrap">
    <div>
      <p v-for="(n, index) in list" :key="index" class="txt">{{n}}</p>
    </div>
    <pullUpUi :noData="noData" :pullUpStatus="pullUpStatus" @pullUp="pullUp"></pullUpUi>
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
      list: 200,
      noData: false,
      pullUpStatus: false
    }
  },
  watch: {
  },
  computed: {
    ...mapState({
      userInfo: state => state.global.userInfo,
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
    },
    pullUp () {
      this.pullUpStatus = true
      setTimeout(() => {
        this.list = this.list + 10
        // 判断数组是否为空 为空则 this.noData = true
        this.getUserInfo().then(res => {
          this.pullUpStatus = false
        })
      }, 1000)
    }
  },
  mounted () {
  }
}
</script>
<style lang="less" scoped>
  .wrap {
    font-size: 30px; /*px*/
    width: 100%;
    .txt {
      display: flex;
      font-size: 24px; /*px*/
      line-height: 12px;
    }
  }
</style>