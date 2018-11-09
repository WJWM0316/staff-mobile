<!--工作圈帖详情-->
<template>
  <div class="postDetail">
    <div class="header">
      <contentheader :item="item" :showCommunicate="false" :showBorder="false" :isCourse="false" @disableOperationEvents="operation" @setPostTop="toTop"></contentheader>
    </div>
    <div class="container">
      <div class="fixed-box" ref="ceiling-box">
        <div class="ceiling-box" :class="navTabName">
          <span @click="toggle('comment')">评论({{item.commentTotal}})</span>
          <span @click="toggle('praise')">点赞({{item.favorTotal}})</span>
        </div>
      </div>
      <!--评论-->
      <template v-if="navTabName === 'comment'">
        <div class="content-praise">
          <div v-for="(commentItem, index) in commentList" :key="index">
            <div>
              <!-- 热门评论 -->
              <div class="hot-area" v-if="item.hotComments.length > 0 && index === 0">
                <i class="hot-icon"><img src="../../assets/icon/icon_hotcomment@3x.png" alt=""></i><span>热门评论</span>
              </div>
              <!-- 全部评论 -->
              <div class="hot-area" v-if="item.commentTotal > 0 && index === item.hotComments.length">
                <i class="hot-icon"><img src="../../assets/icon/tab-massage-3@3x.png" alt=""></i><span>全部评论</span>
              </div>
            </div>
            <div v-if="true">
              <discuss-item
                 :item="commentItem"
                 :index="index"
                 :isShowBorder="index === commentList.length-1 || index === item.hotCommentCount-1? false : true"
                 :isCourse="false"
                 @delComment="delComment">
              </discuss-item>
            </div>
          </div>
          <div v-if="item.commentTotal === 0">
            <p class="community-empty-desc">成为第一个评论的人吧~</p>
          </div>
        </div>
      </template>
      <!-- 点赞 -->
      <template v-else>
        <div class="content-praise">
          <classmate-item v-for="(item,index) in favorList" :key="index" :item="item"></classmate-item>
          <div v-if="item.favorTotal === 0">
            <p class="community-empty-desc">成为第一个点赞的人吧~</p>
          </div>
        </div>
      </template>
    </div>
    <!-- 悬浮输入框 -->
    <suspension-input v-model="displaySuspensionInput"
                      :placeholder="suspensionInputPlaceholder"
                      :commentIndex="commentIndex"
                      :sendText="'发送'"
                      :isShow = 'isShow'
                      @input = "blur"
                      @send="sendComment"
                      ref="input"
      ></suspension-input>
    <actionsheet v-model="addActionsConfig.show" :menus="nowChoosePost.isTop?addActionsConfig.menus2:addActionsConfig.menus" show-cancel @on-click-menu="handleAddActoinItem" />
  </div>
</template>
<script>
import classmateItem from '@c/business/classmateItem'
import contentheader from '@c/business/dynamicItem'
import discussItem from '@c/business/discussItem'
import suspensionInput from '@c/functional/suspensionInput'
import { postDetailApi, firstCommentListlApi, circleCommentApi, commonFavorListApi, commonFavorApi, circlePostToTopApi, delCirclePostToTopApi, getHotCommentListApi } from '@/api/pages/workCircle'
import { Actionsheet } from 'vux'
export default {
  name: 'detail',
  components: {
    contentheader,
    classmateItem,
    discussItem,
    suspensionInput,
    Actionsheet
  },
  data () {
    return {
      navTabName: 'comment',
      item: {},
      page: 1, // 当前评论翻页页数
      commentList: [], // 评论列表
      hotCommentList: [],
      favorList: [], // 点赞列表
      displaySuspensionInput: false,
      suspensionInputPlaceholder: '来分享你的想法吧～',
      isShow: true,
      commentIndex: -1,
      favorPges: 1, // 当前点赞列表翻页页数
      addActionsConfig: { // 置顶评选
        show: false,
        menus: [{
          label: '帖子置顶',
          value: 'selected'
        }],
        menus2: [{
          label: '取消帖子置顶',
          value: 'disSelect'
        }]
      },
      nowChoosePost: '' // 当前选中的要置顶或取消的帖子
    }
  },
  methods: {
    /* 删除评论 */
    delComment (e) {
      this.commentList.splice(e.index, 1)
    },
    /* 切换nav */
    toggle (targetName) {
      if (this.navTabName !== targetName) {
        this.navTabName = targetName
      }
      if (this.navTabName === 'praise' && this.item.favorTotal > 0 && this.favorList.length === 0) {
        this.getFavorList()
      }
    },
    /* 获取热门评论列表 */
    async getHotCommentList () {
      let param = {
        page: this.page,
        count: 20,
        id: this.$route.query.id
      }
      let res = await getHotCommentListApi(param)
      this.hotCommentList.push(...res.data)
    },
    /* 获取评论列表 */
    async getCommentList () {
      let param = {
        page: this.page,
        count: 20,
        id: this.$route.query.id
      }
      let res = await firstCommentListlApi(param)
      this.commentList.push(...this.hotCommentList, ...res.data)
    },
    /* 获取点赞列表 */
    async getFavorList () {
      let param = {
        sourceId: this.item.id,
        sourceType: 'job_circle_post',
        page: this.favorPges
      }
      let res = await commonFavorListApi(param)
      this.favorList.push(...res.data)
    },
    async init () {
      let { id } = this.$route.query
      let res = await postDetailApi(id)
      this.item = res.data
      this.getHotCommentList()
      this.getCommentList()
    },
    /* 点击评论调起底部输入框 */
    async comment (param) {
      this.isShow = true
      this.displaySuspensionInput = true
      this.$refs.input.$refs['suspension-input'].focus()
      this.suspensionInputPlaceholder = '来分享你的想法吧～'
      this.commentIndex = -1
    },
    operation (e) {
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
          break
      }
    },
    blur () {
      this.displaySuspensionInput = false
    },
    /**
     * 发送评论
     * @param data
     */
    async sendComment ({value, commentIndex}) {
      const params = {
        sourceId: this.item.id, // 对应打卡或评论的id
        sourceType: 'job_circle_post', // 对应评论类型是打卡或是回复评论
        content: value // 评论内容
      }
      circleCommentApi(params).then(res => {
        this.getCommentList()
        this.item.commentTotal += 1
        this.$toast({text: '评论成功', type: 'success'})
        this.isShow = false
      }).catch(e => {
        this.$toast({text: '评论失败'})
      })
    },
    /* 调起置顶选项框 */
    toTop (e) {
      this.nowChoosePost = e
      this.addActionsConfig.show = true
      console.log(e)
    },
    /* 选择置顶或取消 */
    async handleAddActoinItem (key, item) {
      if (key === 'selected') {
        circlePostToTopApi({id: this.nowChoosePost.id}).then(res => {
          this.item.isTop = true
          this.$toast({text: '帖子置顶成功', type: 'success'})
        })
      } else {
        delCirclePostToTopApi({id: this.nowChoosePost.id}).then(res => {
          this.item.isTop = false
          this.$toast({text: '取消置顶成功'})
        })
      }
    }
  },
  created () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
.postDetail{
  padding-bottom: 40px;
  .container{
    padding: 0 20px;
    .ceiling-box {
      display: flex;
      align-items: center;
      color: #354048;
      font-size: 30px;/*px*/
      span {
        line-height: 21px;
        margin-right: 32px;
        padding: 18px 0 9px;
      }
      &.comment span:nth-of-type(1),
      &.praise span:nth-of-type(2) {
        color: #354048;
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
    /* 评论标签样式 */
   .hot-area {
      display: flex;
      align-items: center;
      height: 40px;
      font-size: 30px;/*px*/
      font-weight: 300;
      color: #354048;
      background: #F8F8F8;
      border-top: solid 1px #DCDCDC; /* no */
      padding: 0 20px;
      margin-left: -20px;
      margin-right: -20px;
      .hot-icon {
        display: inline-block;
        margin-right: 10px;
        img {
          margin-top: -3px;
          width: 20px;
          height: 20px;
        }
      }
    }
    /* 点赞栏样式    */
    .content-praise{
      margin: 0 -20px;
      padding: 0 20px;
      border-top: solid 1px #DCDCDC;/*px*/
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
}
</style>