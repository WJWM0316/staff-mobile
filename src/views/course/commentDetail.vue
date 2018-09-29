<template>
  <!-- 评论详情页 -->
  <div class="all-reply">
    <!-- header -->
    <div class="header">
      <discuss-item :item="discussInfo" :isShowBorder="false"></discuss-item>
    </div>
    <!-- container -->
    <div class="container">
      <div class="container-title">回复(20)</div>
      <discuss-item></discuss-item>
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
    <div class="footer" v-if="!displaySuspensionInput">
      <div class="page-operation">
        <!-- 点赞按钮 -->
        <button @click="operation({eventType: 'praise'})">
          <img v-if="item.isFavor" class="icon-zan" src="./../../assets/icon/bnt_zan_pre@3x.png" />
          <img v-else class="icon-zan" src="./../../assets/icon/bnt_zan@3x.png" />
          {{item.favorTotal > 0 ? item.favorTotal : '点赞'}}
        </button>
        <span class="split"></span>
        <!-- 评论按钮 -->
        <button @click="comment()">
          <img class="icon-pinglun" src="./../../assets/icon/bnt_comment@3x.png" />
          {{pagination.total > 0 ? pagination.total : '评论'}}
        </button>
      </div>
    </div>
    <!-- 悬浮输入框 -->
    <suspension-input v-model="displaySuspensionInput"
                      :placeholder="suspensionInputPlaceholder"
                      :commentIndex="commentIndex"
                      :sendText="'发送'"
                      :isShow="isShow"
                      @send="sendComment"
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
      displaySuspensionInput: true
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
    /* 触发事件类型 */
    operation (e) {
      const {eventType, itemIndex} = e
      const item = this.discussItemList[itemIndex]
      switch (eventType) {
        case 'comment':
          // :todo 评论请求
          this.comment({item, itemIndex}).then()
          break
        case 'praise':
          this.praise({item, itemIndex}).then()
          break
        case 'del':
          this.del({item, itemIndex}).then()
          break
      }
    },
    /* 调起底部输入框 */
    async comment ({item, itemIndex}) {
      if (itemIndex > -1) {
        this.suspensionInputPlaceholder = '回复' + item.reviewer.realName + ':'
        this.commentIndex = itemIndex
      } else {
        this.suspensionInputPlaceholder = '写评论'
        this.commentIndex = -1
      }
      this.displaySuspensionInput = true
    },
    /* 点赞 */
    async praise () {},
    /* 删除 */
    async del () {},
    /* 发送评论 */
    async sendComment () {}
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
