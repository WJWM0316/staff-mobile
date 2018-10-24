<template>
  <!-- 评论详情页 -->
  <div class="all-reply">
    <!-- header -->
    <div class="header">
      <discuss-item
        :item="discussInfo"
        :isShowBorder="false"
        :isCourse="isCourse"
        :showDel="false"
        :isShowComment="false"
        @disableOperationEvents="operation"
        @delComment="delComment"></discuss-item>
    </div>
    <!-- container -->
    <div class="container">
      <div class="fixed-box" ref="ceiling-box">
        <div class="ceiling-box" :class="navTabName">
          <span @click="toggle('comment')">评论({{discussInfo.commentCount}})</span>
          <span @click="toggle('praise')">点赞({{discussInfo.favorCount}})</span>
        </div>
      </div>
      <template v-if="navTabName === 'comment'">
        <discuss-item v-for="(reply, index) in replyList"
          :key="index"
          :item="reply"
          :index="index"
          :isCourse="isCourse"
          :isShowComment="false"
          :isShowBorder="index === replyList.length-1? false : true"
          @disableOperationEvents="operation"
          @delComment="delComment"></discuss-item>
          <div v-if="discussInfo.commentCount === 0">
            <p class="community-empty-desc">成为第一个评论的人吧~</p>
          </div>
      </template>
      <template v-else>
        <div class="content-praise" v-for="(favorItem, index) in favorList" :key="index">
          <classmate-item :item="favorItem"></classmate-item>
        </div>
        <div v-if="discussInfo.favorCount === 0">
          <p class="community-empty-desc">成为第一个点赞的人吧~</p>
        </div>
      </template>
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
import classmateItem from '@c/business/classmateItem'
import suspensionInput from '@c/functional/suspensionInput'
import { getFavorApi, delFavorApi, courseCardCommentApi, getCommentDetailApi, getReplyListApi, getFavorListApi } from '@/api/pages/course'
import { getCircleCommentDetailApi, getCircleCommentListlApi, circleCommentApi, commonFavorListApi } from '@/api/pages/workCircle'
export default {
  name: 'all-reply',
  components: {
    discussItem,
    suspensionInput,
    classmateItem
  },
  data () {
    return {
      discussInfo: {},
      replyList: [],
      dynamicList: [],
      discussItemList: [],
      commentIndex: -1,
      suspensionInputPlaceholder: '写评论',
      isShow: false,
      displaySuspensionInput: true,
      navTabName: 'comment',
      replyId: '', // 当前回复id
      nowReplyListPage: 1, // 二级评论当前页数
      isCourse: true, // 是否课程评论详情
      favorList: [], // 点赞列表
      favorPges: 1 // 点赞列表翻页
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
      this.$route.query.isCourse === 'false' ? this.isCourse = false : this.isCourse = true
      console.log(this.$route)
      await this.getCommentDetail()
      await this.getReplyList()
    },
    /* 获取一级评论详情 */
    async getCommentDetail () {
      const { id } = this.$route.query
      console.log(this.isCourse)
      let res = {}
      if (this.isCourse) {
        res = await getCommentDetailApi(id)
      } else {
        res = await getCircleCommentDetailApi(id)
      }
      this.discussInfo = res.data
    },
    /* 获取二级评论列表 */
    async getReplyList () {
      let param = {
        id: this.discussInfo.id,
        page: this.nowReplyListPage,
        count: 20,
        sort: 'desc'
      }
      let res = {}
      if (this.isCourse) {
        res = await getReplyListApi(param)
      } else {
        res = await getCircleCommentListlApi(param)
      }
      this.replyList = res.data
    },
    /* 获取点赞列表 */
    async getFavorList () {
      let param = {
        sourceId: this.discussInfo.id,
        sourceType: 'course_section_card_comment',
        page: this.favorPges
      }
      let res = {}
      if (this.isCourse) {
        res = await getFavorListApi(param)
      } else {
        param.sourceType = 'job_circle_comment'
        res = await commonFavorListApi(param)
      }
      this.favorList.push(...res.data)
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
      this.replyId = param.id
      this.isShow = true
      this.displaySuspensionInput = true
    },
    /* 删除 */
    async del () {},
    /* 发送评论 */
    async sendComment ({value, commentIndex}) {
      this.putComment(value).then(res => {
        this.discussInfo.commentCount += 1
        this.getReplyList()
        this.$toast({text: '评论成功', type: 'success'})
      }).catch(e => {
        this.$toast({text: '评论失败'})
      })
    },
    /* 评论一级评论 */
    putComment (value) {
      let params = {
        sourceId: this.replyId, // 对应打卡或评论的id
        sourceType: 'course_section_card_comment', // 对应评论类型是打卡或是回复评论
        content: value // 评论内容
      }
      if (this.isCourse) {
        return courseCardCommentApi(params)
      } else { // 工作圈
        params.sourceType = 'job_circle_comment'
        return circleCommentApi(params)
      }
    },
    /* 切换nav */
    toggle (targetName) {
      if (this.navTabName !== targetName) {
        this.navTabName = targetName
      }
      if (this.navTabName === 'praise' && this.discussInfo.favorCount !== this.favorList.length && this.favorList.length === 0) {
        this.getFavorList()
      }
    },
    /* 删除评论 */
    delComment (e) {
      console.log(e)
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
      .discussItem{
        padding-left: 20px;
        padding-right: 20px ;
      }
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
          font-weight: 700;
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
        font-weight: 700;
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
    .content-praise{
      padding: 0 20px;
    }
    /* 评论及点赞无数据时提示内容样式    */
    .community-empty-desc {
      margin-top: 60px;
      font-size: 28px;/*px*/
      color: #bcbcbc;
      text-align: center;
      margin-bottom: 15px;
    }
  }
</style>
