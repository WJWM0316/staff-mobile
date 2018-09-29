<template>
  <div class="classmateItem" v-if="item">
    <div class="userInfo-img">
      <img class="headImg" :src="item.avatarInfo.smallUrl">
    </div>
    <div class="userInfo-desc">
      <div class="name">{{item.realname}}<span class="managerTitle" v-show="false">管理员</span></div>
      <!-- roleId 4是内部导师 5是外部导师 6是普通学员 -->
      <div class="persion-info" v-if="item.roleId === 5"><span v-for="(n, index) in item.userTitle" :key="index">{{n.title}} </span></div>
      <div class="persion-info" v-else>{{item.occupation}} | {{item.groupName}}</div>
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
  }
}
</script>

<style lang="less" scoped>
.classmateItem {
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
      font-weight: 400;
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
      padding-top: 4px;
      font-size: 26px;/*px*/
      line-height: 17px;
      color: #929292;
    }
  }
}
</style>