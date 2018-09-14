<template>
  <a href="#" class="m-community">
    <!--灯塔头部-->
    <div class="cover-container" :class="{circle:isCircle}">
      <div class="cover"></div>
      <span class="header-photo">
        <img src="https://cdnstatic.ziwork.com/Uploads/static/picture/2018-08-16/791ae930a11c0c8e26415f4151116ee8.jpeg"/>
      </span>
    </div>
    <!--灯塔头部-->

    <div class="info" v-if="!isCircle">
      <h3 class="title">通往百万年薪之路标题【注意标题字高，转行了再长一点看看</h3>
      <p class="desc">技术部 | William</p>
    </div>
    <div class="circleHeader" v-else>
      产品UI设计交流圈
    </div>
    <!--左边加入人数-->
    <div class="member">
      <div class="left">
        <p><span class="num">19</span> 人</p>
        <p>和你一起学习</p>
      </div>
      <!--加入人员头像-->
      <div class="center">
        <img class="user_icon" src="http://thirdwx.qlogo.cn/mmopen/Qb07dBEKiaOGj5ne2EMGgmwAZnfJoNmxvrd1LIOy2Q5HY1ZtnricjJNpsYstFQwiaB2SX5SpGMShiaZffqblLa12ibVo3pMFgB20y/132"/>
        <img class="user_icon" src="http://thirdwx.qlogo.cn/mmopen/Qb07dBEKiaOGj5ne2EMGgmwAZnfJoNmxvrd1LIOy2Q5HY1ZtnricjJNpsYstFQwiaB2SX5SpGMShiaZffqblLa12ibVo3pMFgB20y/132"/>
        <img class="user_icon" src="http://thirdwx.qlogo.cn/mmopen/Qb07dBEKiaOGj5ne2EMGgmwAZnfJoNmxvrd1LIOy2Q5HY1ZtnricjJNpsYstFQwiaB2SX5SpGMShiaZffqblLa12ibVo3pMFgB20y/132"/>
        <img class="user_icon four" src="../../assets/icon/firends-call-more.png"/>
      </div>
      <!--右边入口按钮-->
      <div class="right" v-if="isJoin && !isCircle">
            课程介绍<img class="to_img" src="../../assets/icon/bnt_arrow_int@3x.png"/>
      </div>
      <div class="right" v-if="isCircle">
            设置<img class="to_img" src="../../assets/icon/bnt_arrow_int@3x.png"/>
      </div>
    </div>
  </a>
</template>

<script>
export default {
  name: 'courseHeader',
  props: {
    /* 是否工作圈 */
    isCircle: {
      type: Boolean,
      default: true
    },
    /* 是否已加入课程 */
    isJoin: {
      type: Boolean,
      default: false
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
        height: 90px;
      }
      /*头部改变新增属性*/
      position: relative;
      height: 90px;
      .header-photo{
          display:block;
          width:110px;
          height: 110px;
          box-shadow:0px 4px 19px 0px rgba(75,65,50,0.17);
          position: absolute;
          top: 15px;
          left:50%;
          transform:translateX(-50%);
          margin-bottom:3.75px;
          >img{
            border-radius: 6px;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 0.5px solid #ffffff;
          }
      }
    }
    .circle{
      height: 101px;
      .cover{
        height: 101px;
      }
      .header-photo{
        box-shadow: none;
        width: 80px;
        height: 80px;
        top: 42px;
        >img{
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
      }
    }
  .circleHeader{
    color: #354048;
    font-size: 36px;/*px*/
    font-weight: 500;
    line-height: 22px;
    margin: 29px 0 23px;
    text-align: center;
  }
  .info {
    .title {
      padding: 0 20px;
      margin-top: 55px;
      display: block;
      line-height: 23px;
      font-size: 36px;/*px*/
      font-weight: 500;
      color: #354048;
    }

    .desc {
      padding: 0 20px;
      font-weight: 300;
      font-size: 26px;/*px*/
      display: block;
      margin-top: 6px;
      margin-bottom: 22px;
      line-height: 17px;
      color: #666666;
    }
  }
  .member{
    padding: 0 20px;
    display: flex;
    align-items: center;
    .left{
      margin-right: 15px;
      p{
        color: #929292;
        font-weight: 300;
        font-size: 22px;/*px*/
      }
      .num{
        font-weight: 400;
        color: #D7AB70;
        font-size: 32px;/*px*/
      }
    }
    .center{
      white-space: nowrap;
      margin-right: auto;
      .user_icon{
        border-radius: 50%;
        width: 30px;
        height: 30px;
        border: 0.5px solid #EDEDED;
       margin-left: -11px;
      }
      .user_icon:first-of-type{
        margin-left: 0px;
      }
      .four{
      }
    }
    .right{
      display: flex;
      align-items: center;
      color: #666666;
      font-size: 24px;/*px*/
      font-weight: 300;
      .to_img{
        width: 12px;
        height: 12px;
      }
    }
  }
}
</style>