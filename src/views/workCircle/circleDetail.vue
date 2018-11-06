<template>
  <div class="circleDetail">
    <circle-header :pageInfo="pageInfo" type='2'></circle-header>
    <!--下载文件-->
    <div class="fileDownload">
      <div class="downloadImg" @click.stop="toAlbum">
        <img class="icon" src="../../assets/icon/downloadImg.png" alt="" />
        <span>相册</span>
      </div>
      <div class="downloadFile" @click.stop="toDownLoad(2)">
        <img class="icon" src="../../assets/icon/file.png" alt="" />
        <span>文件</span>
      </div>
      <div class="link" @click.stop="toDownLoad(3)">
        <img class="icon" src="../../assets/icon/link.png"/>
        <span>链接</span>
      </div>
    </div>
    <!--帖子区域-->
    <div class="content">
      <div class="top">
        <div class="postNum">共有 <span style="color: #D7AB70;">{{postListTotal}}</span> 篇帖子</div>
        <div v-if="sort === 'asc'" class="reverse" @click.stop="reverse('desc')"><img src="../../assets/icon/bnt_order@3x.png"/>倒序</div>
        <div v-else class="reverse" @click.stop="reverse('asc')"><img src="../../assets/icon/bnt_order@3x.png"/>正序</div>
      </div>
      <div class="bottom">
        <!--置顶帖子-->
        <div class="priorityPost">
          <div class="priorityPostBox" v-for="(item,index) in postList" :key="index" v-if="item.isTop" @click.stop="toDetail(item)">
            <img class="leftImg" src="../../assets/icon/icon_topping@3x.png"/>
            <span class="txt">{{item.cardContent}}</span>
            <img class="rightImg" src="../../assets/icon/bnt_arrow_int@3x.png"/>
          </div>
        </div>
        <!--帖子-->
        <dynamic-item v-for="(item,index) in postList" :key="index" :item="item" :index="index" :isCourse="false" @setPostTop="toTop" @delPost="delPost" v-if="!item.isTop"></dynamic-item>
      </div>
      <nodata-box v-if="postListTotal === 0"></nodata-box>
      <pullUpUi :noData="all.noData" :pullUpStatus="all.pullUpStatus" @pullUp="pullUp"></pullUpUi>
    </div>
    <!-- 发帖   -->
    <div class="postBox" @click.stop="toEdit" v-if="pageInfo.isMember || pageInfo.isOwner">
      <div class="postInfo">
        <img class="postImg" src="../../assets/icon/icon_writing.png"/>
        <p class="post">发帖</p>
      </div>
    </div>
    <actionsheet v-model="addActionsConfig.show" :menus="addActionsConfig.menus" show-cancel @on-click-menu="handleAddActoinItem" />
  </div>
</template>

<script>
import { getCircleDetailApi, getPostlistApi, circlePostToTopApi, delPostApi } from '@/api/pages/workCircle'
import circleHeader from '@c/business/commonHeader'
import dynamicItem from '@c/business/dynamicItem'
import nodataBox from '@c/business/nodataBox'
import { Actionsheet } from 'vux'
export default {
  name: 'circleDetail',
  components: {
    circleHeader,
    dynamicItem,
    Actionsheet,
    nodataBox
  },
  data () {
    return {
      pageInfo: {},
      nowPage: 1,
      postList: [],
      postListTotal: '', // 帖子数量
      sort: 'desc', // 正序或倒序，默认正序
      addActionsConfig: { // 置顶评选
        show: false,
        menus: [{
          label: '帖子置顶',
          value: 'selected'
        },
        {
          label: '删除帖子',
          value: 'del'
        }],
        menus2: [{
          label: '取消帖子置顶',
          value: 'disSelect'
        },
        {
          label: '删除帖子',
          value: 'del'
        }]
      },
      nowChoosePost: '', // 当前选中的要置顶或取消的帖子
      all: {
        list: [],
        page: 1,
        noData: false,
        pullUpStatus: false
      },
      isLastPage: false // 是否最后一页
    }
  },
  methods: {
    /* 正倒序  */
    async reverse (e) {
      this.sort = e
      let param = {
        id: this.pageInfo.id,
        page: this.nowPage,
        sort: this.sort
      }
      let res = await getPostlistApi(param)
      this.postListTotal = res.meta.total
      this.postList = res.data
    },
    toEdit () {
      this.$router.push({path: `/circleEdit`, query: {id: this.pageInfo.id}})
    },
    /* 初始化方法 */
    async init () {
      const { id } = this.$route.query
      let res = await this.getCircleDetail(id)
      this.pageInfo = res.data
      let postListData = await this.getPostlist(true)
      postListData.meta.currentPage >= postListData.meta.lastPage ? this.isLastPage = true : this.isLastPage = false
      this.postListTotal = postListData.meta.total
      this.postList = postListData.data
    },
    /* 获取工作圈详情 */
    getCircleDetail (id) {
      return getCircleDetailApi(id)
    },
    getPostlist (needLoading) {
      let param = {
        id: this.pageInfo.id,
        page: this.nowPage,
        sort: this.sort
      }
      return getPostlistApi(param, needLoading)
    },
    /* 置顶 */
    toTop (e) {
      this.nowChoosePost = e
      this.addActionsConfig.show = true
    },
    async handleAddActoinItem (key, item) {
      if (key === 'selected ') {
        circlePostToTopApi({id: this.nowChoosePost.id}).then(res => {
          this.reverse(this.sort)
          this.$toast({text: '帖子置顶成功', type: 'success'})
        })
      } else {
        delPostApi(this.nowChoosePost.id).then(res => {
          this.reverse(this.sort)
          this.$toast({text: '删除成功'})
        })
      }
    },
    /* 去帖子详情 */
    toDetail (postItem) {
      console.log(postItem)
      this.$router.push({path: '/postDetail', query: {id: postItem.id}})
    },
    /* 滚动触发事件 */
    async pullUp () {
      if (this.isLastPage) {
        this.all.pullUpStatus = false
        this.all.noData = true
      } else {
        if (this.postList.length <= 0) {
          return
        }
        this.all.pullUpStatus = true
        this.nowPage += 1
        let res = await this.getPostlist(false)
        res.meta.currentPage >= res.meta.lastPage ? this.isLastPage = true : this.isLastPage = false
        this.postListTotal = res.meta.total
        this.postList.push(...res.data)
        this.all.pullUpStatus = false
      }
    },
    /* 去相册 */
    toAlbum () {
      this.$router.push({path: '/album', query: {id: this.pageInfo.id}})
    },
    /* 去下载页 classfy:1为图片，2为文件，3为链接 */
    toDownLoad (classfy) {
      this.$router.push({path: '/fileDownLoad', query: {id: this.pageInfo.id, type: classfy}})
    },
    delPost (index) {
      this.postList.splice(index.index, 1)
    }
  },
  created () {
    this.init()
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'postDetail') {
      next()
    } else {
      next(vm => {
        vm.nowPage = 1
        vm.init()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.circleDetail{
  position: relative;
  min-height: 100vh;
  overflow-y: scroll;
  /*文件下载区域*/
  .fileDownload{
    margin-top: 30px;
    display: flex;
    flex-wrap: nowrap;
    .downloadFile, .downloadImg, .link{
      color: #929292;
      font-size: 26px;/*px*/
      font-weight: 300;
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
        display: flex;
        align-items: center;
        color: #D7AB70;
        font-weight: 300;
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
    .nodata{
      margin-top: 30px;
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
    z-index: 9999;
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
        font-weight: 300;
        color: #D7AB70;
        text-align: center;
        width: 100%;
      }
    }
  }
}
</style>