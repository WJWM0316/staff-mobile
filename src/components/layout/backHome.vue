<template>
  <div class="backHome">
    <div class="home">
      <i class="homeIcon">
        <img src="@a/icon/bnt_homepage@2x.png" alt="">
      </i>
    </div>
  </div>
</template>
<script></script>
<style lang="less">
  .backHome {
    position: fixed;
    top: 35px;
    right: 0;
    .home {
      width: 45px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      .homeIcon {
        width: 18px;
        height: 18px;
        display: block;
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
    }
  }
</style>