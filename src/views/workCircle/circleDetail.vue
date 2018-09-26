<template>
  <div class="circleDetail">
    <circle-header :pageInfo="pageInfo"></circle-header>
    <!--下载文件-->
    <div class="fileDownload">
      <div class="downloadImg">
        <img class="icon" src="../../assets/icon/downloadImg.png" alt="" />
        <span>相册</span>
      </div>
      <div class="downloadFile">
        <img class="icon" src="../../assets/icon/file.png" alt="" />
        <span>文件</span>
      </div>
      <div class="link">
        <img class="icon" src="../../assets/icon/link.png"/>
        <span>链接</span>
      </div>
    </div>
    <!--帖子区域-->
    <div class="content">
      <div class="top">
        <div class="postNum">共有 <span style="color: #D7AB70;">1983</span> 篇帖子</div>
        <div class="reverse" @click.stop="reverse"><img src="../../assets/icon/bnt_order@3x.png"/>倒序</div>
      </div>
      <div class="bottom">
        <!--置顶帖子-->
        <div class="priorityPost">
          <div class="priorityPostBox">
            <img class="leftImg" src="../../assets/icon/icon_topping@3x.png"/>
            <span class="txt">前段时间有位朋友来找我，刚好三人的的发是的发送到发送到发</span>
            <img class="rightImg" src="../../assets/icon/bnt_arrow_int@3x.png"/>
          </div>
          <div class="priorityPostBox">
            <img class="leftImg" src="../../assets/icon/icon_topping@3x.png"/>
            <span class="txt">前段时间有位朋友来找我，刚好三人的的发是的发送到发送到发</span>
            <img class="rightImg" src="../../assets/icon/bnt_arrow_int@3x.png"/>
          </div>
          <div class="priorityPostBox">
            <img class="leftImg" src="../../assets/icon/icon_topping@3x.png"/>
            <span class="txt">前段时间有位朋友来找我，刚好三人的的发是的发送到发送到发</span>
            <img class="rightImg" src="../../assets/icon/bnt_arrow_int@3x.png"/>
          </div>
        </div>
        <!--帖子-->
        <dynamic-item></dynamic-item>
        <dynamic-item></dynamic-item>
        <dynamic-item></dynamic-item>
      </div>
    </div>
    <!-- 发帖   -->
    <div class="postBox" @click.stop="toEdit">
      <div class="postInfo">
        <img class="postImg" src="../../assets/icon/icon_writing.png"/>
        <p class="post">发帖</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getCircleDetailApi } from '@/api/pages/workCircle'
import circleHeader from '@/components/business/commonHeader'
import dynamicItem from '@/components/dynamicItem/dynamicItem'
export default {
  name: 'circleDetail',
  components: {
    circleHeader,
    dynamicItem
  },
  data () {
    return {
      pageInfo: {}
    }
  },
  methods: {
    /* 倒序  */
    reverse () {
      console.log(' 我是倒序事件 ')
    },
    toEdit () {
      this.$router.push(`/workCircle/circleEdit`)
    },
    /* 初始化方法 */
    async init (id) {
      let res = await this.getgetCircleDetail(id)
      this.pageInfo = res.data
    },
    /* ------------------ */
    getgetCircleDetail (id) {
      return getCircleDetailApi(id)
    }
  },
  created () {
    const { id } = this.$route.query
    this.init(id)
  }
}
</script>

<style lang="less" scoped>
.circleDetail{
  height: 100%;
  overflow-y: scroll;
  /*文件下载区域*/
  .fileDownload{
    margin-top: 30px;
    display: flex;
    flex-wrap: nowrap;
    .downloadFile, .downloadImg, .link{
      color: #929292;
      font-size: 26px;/*px*/
      font-weight: 400;
      width: 125px;
      height: 49px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      &::after{
        content: '';
        height: 17px;
        width: 1px;
        background-color: #EDEDED;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
      .icon{
        width: 22px;
        height: 22px;
        margin-right: 8px;
      }
    }
    .link::after{
      display: none;
    }
  }
  /*帖子区域*/
  .content{
    .top{
      font-size: 28px;/*px*/
      width: 100%;
      height: 40px;
      background-color: #F9F9F9;
      box-sizing: border-box;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      >.postNum{
        font-weight: 300;
        color: #929292;
      }
      >.reverse{
        color: #D7AB70;
        font-weight: 400;
        >img{
          width: 15px;
          height: 15px;
        }
      }
    }
    .bottom{
      overflow-y: scroll;
      .priorityPost{
        padding-left: 20px;
        .priorityPostBox{
          width: 100%;
          height: 48px;
          border-bottom: 0.5px solid #EDEDED;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          >.leftImg{
            width: 20px;
            height: 20px;
            margin-right: 8px;
          }
          >.txt{
            width: 291px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            font-weight: 300;
            font-size: 30px;/*px*/
            color: #354048;
          }
          >.rightImg{
            width: 15px;
            height: 15px;
          }
        }
      }
    }
  }
  /*发帖悬浮窗样式*/
  .postBox{
    position: fixed;
    bottom: 25px;
    right: 20px;
    width: 75px;
    height: 75px;
    border-radius: 50%;
    box-shadow: 0px 6px 12px 4px rgba(0,0,0,0.08);
    .postInfo{
      display: flex;
      align-content: center;
      justify-content: center;
      flex-wrap: wrap;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #FFFFFF;
      box-shadow: 0px -1px 1px 1px rgba(0,0,0,0.08) inset;
      >.postImg{
        display: block;
        margin: 0 auto;
        width: 22px;
        height: 23px;
      }
      >.post{
        margin-top: 5px;
        font-size: 22px;/*px*/
        font-weight: 400;
        color: #D7AB70;
        text-align: center;
        width: 100%;
      }
    }
  }
}
</style>