<template>
  <div class="classmateItem" v-if="item">
    <div class="userInfo-img">
      <img class="headImg" :src="item.fromUserAvatar.smallUrl || '../../assets/icon/img_head_default.png'">
    </div>
    <div class="userInfo-desc">
      <div class="name">{{item.fromUserName}}<span class="managerTitle" v-show="showMangerTitle">管理员</span></div>
      <div class="persion-info">{{item.fromUserGroup}}   |  {{item.fromUserOccupation}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'classmateItem',
  props: {
    /* 是否展示管理员标志  */
    showMangerTitle: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object
    }
  },
  data () {
    return {}
  },
  created () {
    console.log(this.item, ' 33333333333333 ')
  }
}
</script>

<style lang="less" scoped>
.classmateItem {
  padding: 15px 0;
  display: flex;
  align-items: center;

  .userInfo-img {
    .headImg{
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
  .userInfo-desc {
    margin-left: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    .name {
      display: flex;
      align-items: center;
      font-size: 30px;/*px*/
      color: #354048;
      font-weight: 400;
      .managerTitle{
        display: inline-block;
        font-size: 24px;/*px*/
        line-height: 18px;
        color: #D7AB70;
        margin-left: 13px;
        text-align: center;
        border-radius: 10px;
        width: 51px;
        height: 18px;
        border: 1px solid #D7AB70;/*no*/
      }
    }
    .persion-info{
      padding-top: 5px;
      font-size: 26px;/*px*/
      line-height: 17px;
      color: #929292;
    }
  }
}
</style>