<template>
  <div class="noDataShow">
    <div class="photo">
      <img src="@a/icon/error_404@3x.png" alt="">
    </div>
    <p class="txt">暂时还没有内容哦～</p>
  </div>
</template>
<style lang="less" scoped>
  .noDataShow {
    padding: 50px 0;
    .photo {
      width: 120px;
      height: 120px;
      margin: 0 auto;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .txt {
      font-size: 28px; /*px*/
      margin-top: 15px;
      line-height: 14px;
      text-align: center;
      color: #BCBCBC;
      font-weight: 300;
    }
  }
</style>