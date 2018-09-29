<template>
  <!-- 评论详情页 -->
  <div class="all-reply">
    <!-- header -->
    <div class="header">
      <discuss-item :item="discussInfo" :isShowBorder="false" @disableOperationEvents="operation"></discuss-item>
    </div>
    <!-- container -->
    <div class="container">
      <div class="fixed-box" ref="ceiling-box">
        <div class="ceiling-box" :class="navTabName">
          <span @click="toggle('comment')">评论({{discussInfo.commentCount}})</span>
          <span @click="toggle('praise')">点赞({{discussInfo.favorCount}})</span>
        </div>
      </div>
      <discuss-item :item="discussInfo" :isShowBorder="false" @disableOperationEvents="operation"></discuss-item>
    </div>
      <!--<div class="ask-box {{isShowPumpBtn ? 'show' : ''}}">-->
      <!--<div class="user-input">-->
      <!--<input type="text" placeholder="{{placeholderText}}"-->
      <!--bindblur="sleep"-->
      <!--@confirm="sendComment"-->
      <!--focus="{{isPumpFocus}}"-->
      <!--bindinput="bindInputPump"-->
      <!--value="{{pumpContent}}"-->
      <!--maxlength="1000"-->
      <!--placeholder-style="color: #bcbcbc"-->
      <!--cursor-spacing="20" />-->
      <!--</div>-->
      <!--<text class="ask-btn" @tap="sendComment">发送</text>-->
      <!--</div>-->
    <!-- footer -->
    <!-- 悬浮输入框 -->
    <suspension-input v-model="displaySuspensionInput"
                      :placeholder="suspensionInputPlaceholder"
                      :commentIndex="commentIndex"
                      :sendText="'发送'"
                      :isShow="isShow"
                      @send="sendComment"
                      ref="input"
    ></suspension-input>
  </div>
</template>
<script>
import discussItem from '@c/business/discussItem'
import suspensionInput from '@c/functional/suspensionInput'
import { getFavorApi, delFavorApi, courseCardCommentApi, getCommentDetailApi } from '@/api/pages/course'
export default {
  name: 'all-reply',
  components: {
    discussItem,
    suspensionInput
  },
  data () {
    return {
      discussInfo: {},
      dynamicList: [],
      discussItemList: [],
      commentIndex: -1,
      suspensionInputPlaceholder: '写评论',
      isShow: false,
      displaySuspensionInput: true,
      navTabName: 'comment'
    }
  },
  computed: {},
  watch: {
    displaySuspensionInput (val) {
      this.isShow = val
    }
  },
  methods: {
    async pageInit () {
      this.getCommentDetail()
    },
    /* 获取评论详情 */
    async getCommentDetail () {
      const { id } = this.$route.query
      let res = await getCommentDetailApi(id)
      this.discussInfo = res.data
    },
    /* 组件触发的事件 */
    operation (e) {
      console.log(e, ' 我是带回来的数据 ')
      const {eventType, param} = e
      switch (eventType) {
        case 'comment':
          // :todo 评论请求
          this.comment(param).then()
          break
        case 'praise':
          this.praise(param)
          break
        case 'del':
          console.log(' 我是删除 ')
          break
        case 'comment-area':
          this.jumpCommentDetail(param)
      }
    },
    /* 调起底部输入框 */
    async comment (param) {
      console.log(param.id)
      this.isShow = true
      /* if (itemIndex > -1) {
        this.suspensionInputPlaceholder = '回复' + item.reviewer.realName + ':'
        this.commentIndex = itemIndex
      } else {
        this.suspensionInputPlaceholder = '写评论'
        this.commentIndex = -1
      } */
      this.displaySuspensionInput = true
    },
    /* 删除 */
    async del () {},
    /* 发送评论 */
    async sendComment ({value, commentIndex}) {
      const params = {
        sourceId: this.discussInfo.id, // 对应打卡或评论的id
        sourceType: 'course_section_card_comment', // 对应评论类型是打卡或是回复评论
        content: value // 评论内容
      }
      courseCardCommentApi(params).then(res => {
        this.discussInfo.commentCount += 1
        this.$toast({text: '评论成功', type: 'success'})
      }).catch(e => {
        this.$toast({text: '评论失败'})
      })
      console.log(' 已经发送 ')
    },
    /* 切换nav */
    toggle (targetName) {
      if (this.navTabName !== targetName) {
        this.navTabName = targetName
      }
    }
  },
  created () {
    this.pageInit()
  }
}
</script>
<style lang="less" scoped>
  .all-reply {
    box-sizing: border-box;
    padding: 0 20px;
    padding-bottom: 50px;
    height: 100%;
    & .container {
      margin-left: -20px;
      margin-right: -20px;
      .fixed-box{
        border-bottom: solid 0.5px #DCDCDC; /* no */
      }
      .ceiling-box {
        display: flex;
        padding: 0 20px;
        align-items: center;
        color: #354048;
        font-size: 30px;/*px*/
        span {
          font-weight: 500;
          line-height: 21px;
          margin-right: 31.5px;
          padding: 17.5px 0 8px;
        }
        &.comment span:nth-of-type(1),
        &.praise span:nth-of-type(2) {
          color: #354048;
          font-weight: 700;
          position: relative;
        }
        &.comment span:nth-of-type(1):after,
        &.praise span:nth-of-type(2):after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 2px;
          border-radius: 2px;
          background-color: #FFE266;
        }
      }
      & .container-title {
        font-size: 15px;
        font-weight: 500;
        color: #354048;
        padding: 10px 0;
        border-bottom: solid 1px #dcdcdc; /* no */
      }
    }
    .footer {
      position: fixed;
      bottom: 0;
      right: 0;
      left: 0;
      & .page-operation {
        display: flex;
        align-items: center;
        border-top: solid 1px #ededed; /* no */
        background: #FFF;

        & > button{
          flex: 1 1 auto;
          height: 50px;
          font-size: 15px;
          color: #666666;
          border-style: none;
          outline: none;
          line-height: 1;
          background-color: transparent;
          text-align: center;
        }

        & .split {
          width: 1px;
          height: 20px;
          background-color: #dcdcdc;
        }
      }

      & .icon-zan, & .icon-pinglun {
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-right: 2px;
      }
    }
  }
</style>
