<template>
  <div class="postDetail" v-if="item">
    <div class="header">
      <contentheader :showCommunicate="false" :showBorder="false" :item="item" @disableOperationEvents="operation" @setPostTop="setPostTop"></contentheader>
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
          <div class="hot-area" v-if="index === hotCommentNum">
            <i class="hot-icon"><img src="../../assets/icon/tab-massage-3@3x.png" alt=""></i><span>全部评论</span>
          </div>
          <discuss-item :index="index"
            :item="commentItem"
            :isShowBorder="index === commentList.length-1 || index === hotCommentNum-1? false : true"
            @delComment="delComment"></discuss-item>
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
      <pullUpUi :noData="all.noData" :pullUpStatus="all.pullUpStatus" @pullUp="pullUp"></pullUpUi>
    </div>
    <!-- 悬浮输入框 -->
    <suspension-input
      :placeholder="suspensionInputPlaceholder"
      :commentIndex="commentIndex"
      :sendText="'发送'"
      :isShow = 'isShow'
      @send="sendComment"
      ref="input"
    ></suspension-input>
    <actionsheet v-model="addActionsConfig.show" :menus="nowChoosePunch.isExcellentCard === 1?addActionsConfig.menus2:addActionsConfig.menus" show-cancel @on-click-menu="handleAddActoinItem" />
  </div>
</template>

<script>
import classmateItem from '@c/business/classmateItem'
import contentheader from '@c/business/dynamicItem'
import discussItem from '@c/business/discussItem'
import { Actionsheet } from 'vux'
import suspensionInput from '@c/functional/suspensionInput'
import { getPunchCardDetailsApi, courseCardCommentApi, getFavorListApi, getCommentListApi, getHotCommentListApi, setExcellentCourseCardApi } from '@/api/pages/course'
export default {
  components: {
    contentheader,
    classmateItem,
    discussItem,
    Actionsheet,
    suspensionInput
  },
  data () {
    return {
      navTabName: 'comment',
      item: '',
      suspensionInputPlaceholder: '来分享你的想法吧～',
      isShow: true,
      commentIndex: -1,
      isLastPage: false,
      nowPges: 1, // 点赞列表当前页数
      page: 1, // 评论列表当前页数
      favorList: [], // 点赞列表
      commentList: [], // 评论列表
      hotCommentNum: '', // 热门评论条数
      nowChoosePunch: '', // 当前选择的要评选或取消评选优秀打卡的打卡
      addActionsConfig: {
        show: false,
        menus: [{
          label: ' 选为优秀打卡 ',
          value: ' selected '
        }],
        menus2: [{
          label: ' 取消优秀打卡 ',
          value: ' disSelect '
        }]
      },
      all: {
        noData: false,
        pullUpStatus: false
      }
    }
  },
  methods: {
    /* 切换nav */
    toggle (targetName) {
      if (this.navTabName !== targetName) {
        this.navTabName = targetName
        if (this.navTabName === 'praise') {
          this.isShow = false
          /* 点赞列表 */
          if (this.favorList.length !== this.item.favorTotal) {
            this.getFavorList()
          }
        } else {
          this.isShow = true
        }
      }
    },
    /* 获取打卡点赞列表 */
    async getFavorList () {
      let param = {
        sourceId: this.item.courseSectionCardId,
        page: this.nowPges,
        sourceType: 'course_section_card'
      }
      let res = await getFavorListApi(param)
      res.meta.nextPageUrl ? this.isLastPage = false : this.isLastPage = true
      if (this.nowPges === 1) {
        this.favorList = [...res.data]
      } else {
        this.favorList.push(...res.data)
      }
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
        this.assembleList()
        this.item.commentTotal += 1
        this.$toast({text: '评论成功', type: 'success'})
      })
    },
    /* 点击评论调起底部输入框 */
    async comment (param) {
      this.isShow = true
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
      return res.data
    },
    /* 获取全部打卡评论列表 */
    async getCommentList () {
      let param = {
        postId: this.item.courseSectionCardId,
        page: this.page
      }
      let res = await getCommentListApi(param)
      res.meta.nextPageUrl ? this.isLastPage = false : this.isLastPage = true
      return res.data
    },
    /* 合并热门评论与全部评论 */
    async assembleList () {
      let hot = await this.getHotCommentList()
      let all = await this.getCommentList()
      this.commentList = [...hot, ...all]
    },
    /* 获取打卡详情 */
    async getPunchCardDetails () {
      let { id } = this.$route.query
      let res = await getPunchCardDetailsApi({name: 'courseSectionCardId', id: id})
      this.item = res.data.peopleCourseCardInfo
    },
    async init () {
      await this.getPunchCardDetails()
      this.assembleList()
    },
    /* 删除评论 */
    delComment (index) {
      console.log(index)
      this.commentList.splice(index.index, 1)
      if (index.index < this.hotCommentNum) {
        this.hotCommentNum -= 1
      }
    },
    /* 评选优秀打卡 */
    async setPostTop (item) {
      console.log(item)
      this.addActionsConfig.show = true
      this.nowChoosePunch = item
    },
    async handleAddActoinItem (key, item) {
      if (!item) return
      console.log(this.nowChoosePunch.isExcellentCard === 0, this.nowChoosePunch.isExcellentCard)
      let param = {
        course_section_card_id: this.nowChoosePunch.courseSectionCardId,
        is_set_excellent_card: this.nowChoosePunch.isExcellentCard === 0 ? 1 : 0
      }
      await setExcellentCourseCardApi(param)
      await this.getPunchCardDetails()
      if (this.nowChoosePunch.isExcellentCard) {
        this.$toast({text: '取消成功', type: 'success'})
      } else {
        this.$toast({text: '设置成功', type: 'success'})
      }
    },
    /* 上拉加载 */
    async pullUp () {
      console.log(this.isLastPage)
      if (this.isLastPage) {
        this.all.noData = true
        this.all.pullUpStatus = false
      } else {
        if (this.navTabName === 'comment') {
          this.page += 1
          let all = await this.getCommentList()
          this.commentList.push(...all)
        } else {
          this.nowPges += 1
          this.getFavorList()
        }
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
  box-sizing: border-box;
  .container{
    padding: 0 20px;
    padding-bottom: 20px;
    .ceiling-box {
      display: flex;
      align-items: center;
      color: #354048;
      font-size: 30px;/*px*/
      border-bottom: solid 0.5px #DCDCDC; /* no */
      span {
        line-height: 21px;
        margin-right: 32px;
        padding: 18px 0 9px;
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