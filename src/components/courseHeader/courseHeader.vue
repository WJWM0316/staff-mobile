<template>
  <a href="#" class="m-community">
    <!--灯塔头部-->
    <div class="cover-container">
      <div class="cover"></div>
      <span class="header-photo">
        <img src="https://cdnstatic.ziwork.com/Uploads/static/picture/2018-08-16/791ae930a11c0c8e26415f4151116ee8.jpeg"/>
      </span>
    </div>
    <!--灯塔头部-->

    <div class="info" v-if="false">
      <h3 class="title">通往百万年薪之路标题【注意标题字高，转行了再长一点看看</h3>
      <p class="desc">技术部 | William</p>
    </div>
    <div class="circleHeader" v-else>
      产品UI设计交流圈
    </div>
    <div class="member">
      <div class="left">
        <p><span class="num">19</span> 人</p>
        <p>和你一起学习</p>
      </div>
      <div class="center">
        <img class="user_icon" src="http://thirdwx.qlogo.cn/mmopen/Qb07dBEKiaOGj5ne2EMGgmwAZnfJoNmxvrd1LIOy2Q5HY1ZtnricjJNpsYstFQwiaB2SX5SpGMShiaZffqblLa12ibVo3pMFgB20y/132"/>
        <img class="user_icon" src="http://thirdwx.qlogo.cn/mmopen/Qb07dBEKiaOGj5ne2EMGgmwAZnfJoNmxvrd1LIOy2Q5HY1ZtnricjJNpsYstFQwiaB2SX5SpGMShiaZffqblLa12ibVo3pMFgB20y/132"/>
        <img class="user_icon" src="http://thirdwx.qlogo.cn/mmopen/Qb07dBEKiaOGj5ne2EMGgmwAZnfJoNmxvrd1LIOy2Q5HY1ZtnricjJNpsYstFQwiaB2SX5SpGMShiaZffqblLa12ibVo3pMFgB20y/132"/>
        <img class="user_icon four" src="../../assets/icon/firends-call-more.png"/>
      </div>
      <div class="right" v-if="type === 0">
            课程介绍<img class="to_img" src="../../assets/icon/bnt_arrow_int@3x.png"/>
      </div>
    </div>
  </a>
</template>

<script>
export default {
  name: 'courseHeader',
  props: {
    type: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="less" type="text/less">
@import url("~STYLE/mixins.less");
.m-community {
  display: block;
  .cover-container {
      .cover {
        background: #F2F2F2;
        width: 100%;
        height: 180px;
      }
      /*头部改变新增属性*/
      position: relative;
      height: 174px;
      .header-photo{
          display:block;
          width:160px;
          height: 160px;
          position: absolute;
          top: 84px;
          left:50%;
          transform:translateX(-50%);
          margin-bottom:7.5px;
          >img{
            border-radius: 50%;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 1px solid #ffffff;
          }
      }
    }
  .circleHeader{
    color: #354048;
    font-size: 36px;/*px*/
    font-weight: 500;
    line-height: 44px;
    margin: 57px 0 46px;
    text-align: center;
  }
  .info {
    .title {
      padding: 0 40px;
      margin-top: 110px;
      display: block;
      line-height: 46px;
      font-size: 36px;
      font-weight: 500;
      color: #354048;
    }

    .desc {
      padding: 0 40px;
      font-weight: 300;
      font-size: 26px;/*px*/
      display: block;
      margin-top: 12px;
      margin-bottom: 44px;
      line-height: 34px;
      color: #666666;
    }
  }
  .member{
    padding: 0 40px;
    display: flex;
    align-items: center;
    .left{
      margin-right: 30px;
      p{
        color: #929292;
        font-weight: 300;
        font-size: 22px;/*px*/
      }
      .num{
        font-weight: 400;
        color: #D7AB70;
        font-size: 32px;
      }
    }
    .center{
      white-space: nowrap;
      margin-right: auto;
      .user_icon{
        border-radius: 50%;
        width: 60px;
        height: 60px;
        border: 1px solid #EDEDED;/*px*/
       margin-left: -22px;/*px*/
      }
      .user_icon:first-of-type{
        margin-left: 0px;/*px*/
      }
      .four{
      }
    }
    .right{
      display: flex;
      align-items: center;
      color: #666666;
      font-size: 24px;
      font-weight: 300;
      .to_img{
        width: 24px;
        height: 24px;
      }
    }
  }
}
</style>