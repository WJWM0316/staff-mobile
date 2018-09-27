<template>
  <div class="classmateItem">
    <div class="userInfo-img">
      <img class="headImg" :src="item.avatar || '../../assets/icon/img_head_default.png'">
    </div>
    <div class="userInfo-desc">
      <div class="name">我是谁 <span class="managerTitle" v-show="showMangerTitle">管理员</span></div>
      <div class="persion-info">我做啥   |  我是谁是是是是是</div>
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
    }
  },
  data () {
    return {
      item: {
        avatar: 'http://thirdwx.qlogo.cn/mmopen/BMibibqZYibkicaJicQQ3zlN78Ibr0Xa8Fk6yt3zjvavI9Vgb5RjiarPAjJWAwkqMukJq8oicNyH7Pibzs9TDBG3PMMkWgPetlAdj42o/132',
        avatarUrl: 'http://thirdwx.qlogo.cn/mmopen/BMibibqZYibkicaJicQQ3zlN78Ibr0Xa8Fk6yt3zjvavI9Vgb5RjiarPAjJWAwkqMukJq8oicNyH7Pibzs9TDBG3PMMkWgPetlAdj42o/132',
        realName: 'LeonW'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.classmateItem {
  border-bottom: 1px solid #dcdcdc; /* no */
  padding: 30px 0;
  display: flex;
  align-items: center;

  .userInfo-img {
    .headImg{
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
  }
  .userInfo-desc {
    margin-left: 30px;
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
        line-height: 36px;
        color: #D7AB70;
        margin-left: 27px;
        text-align: center;
        border-radius: 20px;
        width: 102px;
        height: 36px;
        border: 1px solid #D7AB70;/*no*/
      }
    }
    .persion-info{
      padding-top: 10px;
      font-size: 26px;/*px*/
      line-height: 34px;
      color: #929292;
    }
  }
}
</style>