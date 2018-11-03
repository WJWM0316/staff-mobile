<template>
  <div class="enterpriseList">
    <div class="item border-bottom-1px" :class="{'cur': company === n.code}" @click.stop="chose(n)" v-for="n in list" :key="n.id">
      {{n.code}}
      <img class="icon" src="@a/icon/btn_enter@2x.png" alt="">
    </div>
  </div>
</template>
<script>
import { getEnterpriseListApi } from '@/api/pages/center'
import { login } from '@/api/require'
import localstorage from '@u/localstorage'
export default {
  data () {
    return {
      list: [],
      company: localstorage.get('XPLUSCompany')
    }
  },
  methods: {
    chose (n) {
      if (this.company === n.code) {
        this.$toast({
          text: '您已在当前公司',
          width: '9em'
        })
        return
      }
      this.company = n.code
      let data = localstorage.get('account')
      localstorage.set('XPLUSCompany', n.code) // 储存公司code
      localstorage.set('XPLUSCompanyName', n.companyName) // 储存公司名
      login(data, 1, this.company).then(res => {})
    }
  },
  created () {
    getEnterpriseListApi().then(res => {
      this.list = res.data
    })
  }
}
</script>
<style lang="less" scoped>
  .enterpriseList {
    margin-top: 20px;
    padding: 0 20px;
    .item {
      padding: 21px 0 21px 25px;
      position: relative;
      font-size: 30px; /*px*/
      font-weight: 300;
      color: #354048;
      &.cur::before {
        content: '';
        width: 16px;
        height: 16px;
        background: url('../../assets/icon/check-circle.png') no-repeat;
        background-size: 100% 100%;
        display: block;
        position: absolute;
        top: 50%;
        margin-top: -8px;
        left: 0;
      }
      .icon {
        width: 20px;
        height: 20px;
        display: inline-block;
        float: right;
      }
    }
  }
</style>