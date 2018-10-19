<template>
  <div class="classmateItem" v-if="item" @click.stop="toPersonPage">
    <div class="userInfo-img">
      <img class="headImg" v-lazyload :src="item.avatarInfo.smallUrl || '@a/icon/default.png'">
    </div>
    <div class="userInfo-desc">
      <div class="name">{{item.realname}}<span class="managerTitle" v-show="false">管理员</span></div>
      <!-- roleId 4是内部导师 5是外部导师 6是普通学员 -->
      <div class="persion-info" v-if="item.roleId === 5 || item.userTitle"><span v-for="(n, index) in item.userTitle" :key="index">{{n.title}} </span></div>
      <div class="persion-info" v-else>{{item.occupation || '该成员未设置职称'}} | {{item.groupName || '未设置部门'}}</div>
    </div>
    <div class="excellent" v-if="item.punchCardCount">
      <p><span class="punchCount">{{item.punchCardCount}}</span> 次</p>
      <p>优秀打卡</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'classmateItem',
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    toPersonPage () {
      let id = this.item.uid || this.item.toUid || this.item.id
      this.$router.push({path: '/personalPage', query: {uid: id}})
    }
  }
}
</script>

<style lang="less" scoped>
.classmateItem {
  margin-top: 15px;
  padding: 15px 0 0 65px;
  position: relative;
  .userInfo-img {
    overflow: hidden;
    border-radius: 50%;
    border: 1px solid rgba(220,220,220,1);
    width: 50px;
    height: 50px;
    position: absolute;
    top: 15px;
    left: 0;
    .headImg{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .userInfo-desc {
    display: flex;
    width: 100%;
    height: 50px;
    flex-direction: column;
    justify-content: center;
    .name {
      font-size: 30px;/*px*/
      color: #354048;
      font-weight: 300;
      .managerTitle{
        display: inline-block;
        font-size: 24px;/*px*/
        color: #D7AB70;
        margin-left: 13px;
        border-radius: 10px;
        width: 51px;
        height: 18px;
        border: 1px solid #D7AB70;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .persion-info{
      font-weight: 300;
      padding-top: 4px;
      font-size: 26px;/*px*/
      line-height: 17px;
      color: #929292;
    }
  }
  .excellent{
    text-align: center;
    position: absolute;
    right: 0;
    top: 10px;
    font-size: 24px;/*px*/
    color: #929292;
    .punchCount{
      font-size: 48px;/*px*/
      color: #D7AB70;
    }
  }
}
</style>