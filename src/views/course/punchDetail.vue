<template>
  <div class="postDetail" v-if="item">
    <div class="header">
      <contentheader :showCommunicate="false" :showBorder="false" :item="item" @disableOperationEvents="operation"></contentheader>
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
        <!--有评论时-->
        <div v-for="(commentItem,index) in commentList" :key="index" v-if="item.commentTotal > 0">
          <!-- 热门评论 -->
          <div class="hot-area" v-if="hotCommentNum > 0 && index === 0">
            <i class="hot-icon"><img src="../../assets/icon/icon_hotcomment@3x.png" alt=""></i><span>热门评论</span>
          </div>
          <!--全部评论-->
          <div class="hot-area" v-if="commentItem.isHot === 0 && index === hotCommentNum">
            <i class="hot-icon"><img src="../../assets/icon/tab-massage-3@3x.png" alt=""></i><span>全部评论</span>
          </div>
          <discuss-item :index="index" :item="commentItem" :isShowBorder="index === commentList.length-1 || index === hotCommentNum-1? false : true" @delComment="delComment"></discuss-item>
        </div>
        <!--没有任何评论时-->
        <div v-if="item.commentTotal === 0">
          <p class="community-empty-desc">成为第一个评论的人吧~</p>
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
  </div>
</template>

<script>
import classmateItem from '@c/business/classmateItem'
import contentheader from '@c/business/dynamicItem'
import discussItem from '@c/business/discussItem'
import suspensionInput from '@c/functional/suspensionInput'
import { getPunchCardDetailsApi, courseCardCommentApi, getFavorListApi, getCommentListApi, getHotCommentListApi } from '@/api/pages/course'
export default {
  components: {
    contentheader,
    classmateItem,
    discussItem,
    suspensionInput
  },
  data () {
    return {
      navTabName: 'comment',
      item: '',
      displaySuspensionInput: false,
      suspensionInputPlaceholder: '来分享你的想法吧～',
      isShow: false,
      commentIndex: -1,
      nowPges: 1, // 点赞列表当前页数
      page: 1, // 评论列表当前页数
      favorList: [], // 点赞列表
      commentList: [], // 评论列表
      hotCommentNum: '' // 热门评论条数
    }
  },
  methods: {
    /* 切换nav */
    toggle (targetName) {
      if (this.navTabName !== targetName) {
        this.navTabName = targetName
        if (this.navTabName === 'praise') {
          /* 点赞列表 */
          if (this.favorList.length === 0) {
            this.getFavorList()
          }
        }
      }
    },
    /* 获取打卡点赞列表 */
    async getFavorList () {
      let param = {
        postId: this.item.courseSectionCardId,
        page: this.nowPges
      }
      let res = await getFavorListApi(param)
      this.favorList.push(...res.data)
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
        sourceId: this.item.courseSectionCardId, // 对应打卡或评论的id
        sourceType: 'course_section_card', // 对应评论类型是打卡或是回复评论
        content: value // 评论内容
      }
      courseCardCommentApi(params).then(res => {
        this.getCommentList()
        this.item.commentTotal += 1
        this.$toast({text: '评论成功', type: 'success'})
      })
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
    /* 获取热门评论列表 */
    async getHotCommentList () {
      let param = {
        postId: this.item.courseSectionCardId,
        count: 3
      }
      let res = await getHotCommentListApi(param)
      this.hotCommentNum = res.data.length
      this.commentList.push(...res.data)
    },
    /* 获取全部打卡评论列表 */
    async getCommentList () {
      let param = {
        postId: this.item.courseSectionCardId,
        page: this.page
      }
      let res = await getCommentListApi(param)
      this.commentList.push(...res.data)
    },
    /* 获取打卡详情 */
    async getPunchCardDetails () {
      let { id } = this.$route.query
      let res = await getPunchCardDetailsApi({name: 'courseSectionCardId', id: id})
      this.item = res.data.peopleCourseCardInfo
    },
    async init () {
      await this.getPunchCardDetails()
      await this.getHotCommentList()
      await this.getCommentList()
    },
    /* 删除评论 */
    delComment (index) {
      this.commentList.splice(index, 1)
    }
  },
  created () {
    this.init()
  }
}
</script>

<style lang="less" scoped>
.postDetail{
  .container{
    padding: 0 20px;
    .ceiling-box {
      display: flex;
      align-items: center;
      color: #354048;
      font-size: 30px;/*px*/
      border-bottom: solid 0.5px #DCDCDC; /* no */
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
    /* 评论标签样式 */
   .hot-area {
      display: flex;
      align-items: center;
      height: 40px;
      font-size: 30px;/*px*/
      font-weight: 300;
      color: #354048;
      background: #F8F8F8;
      border-top: solid 0.5px #DCDCDC; /* no */
      padding: 0 20px;
      margin-left: -20px;
      margin-right: -20px;
      .hot-icon {
        display: inline-block;
        margin-right: 10px;
        img {
          margin-top: -2.5px;
          width: 20px;
          height: 20px;
        }
      }
    }
    /* 点赞栏样式    */
    .content-praise{
      margin: 0 -20px;
      padding: 0 20px;
      border-top: solid 0.5px #DCDCDC;
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