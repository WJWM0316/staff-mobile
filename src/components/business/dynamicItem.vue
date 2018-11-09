<template>
  <div class="dynamicItem" :class="{bottomBorder : showBorder}" @click.stop="toDetail">
    <div class="header">
      <img class="headerPhoto" v-if="item.releaseUser" :src="item.releaseUser.avatarInfo.smallUrl" />
      <div class="appellation" v-if="item.releaseUser" @click.stop="toUserInfo(item.releaseUser.id)">{{item.releaseUser.realname}}</div>
      <!--置顶按钮-->
      <div class="topBox">
        <div class="isTopping" v-if="item.isTop"><img src="../../assets/icon/icon_topping@3x.png" /></div>
        <div class="evaluate" @click.stop="toTop" v-if="item.isOwner || item.isTutor">...</div>
      </div>
    </div>
    <div class="content">
      <div ref="circle-content">
        <p class="content-text ellipsis">{{item.cardContent}}</p>
        <p class="full-text-btn">{{isFullText('circle-content')}}</p>
      </div>
      <!--课程图片-->
      <div class="content-images" v-if="item.cardContentFile && item.cardContentFile.length > 0" v-preview="true">
        <div class="item-image one" v-if="item.cardContentFile.length === 1">
          <img :src="item.cardContentFile[0].middleUrl || '../../assets/icon/img_head_default.png'" :data-src="item.cardContentFile[0].url"/>
        </div>
        <div class="item-image four" v-for="(item,index) in item.cardContentFile" :key="index" v-else-if="item.cardContentFile.length === 4">
          <img :src="item.middleUrl || '../../assets/icon/img_head_default.png'" :data-src="item.url"/>
        </div>
        <div class="item-image" v-for="(item,index) in item.cardContentFile" :key="index" v-else>
          <img :src="item.middleUrl || '../../assets/icon/img_head_default.png'" :data-src="item.url"/>
        </div>
      </div>
      <!--工作圈图片-->
      <div class="content-images" v-if="item.type === '图片'" v-preview="openPreview">
        <div class="item-image one" v-if="item.accessory.length === 1">
          <img :src="item.accessory[0].middleUrl || '../../assets/icon/img_head_default.png'" :data-src="item.accessory[0].url"/>
        </div>
        <div class="item-image four" v-for="(item,index) in item.accessory" :key="index" v-else-if="item.accessory.length === 4">
          <img :src="item.middleUrl || '../../assets/icon/img_head_default.png'" :data-src="item.url"/>
        </div>
        <div class="item-image" v-for="(item,index) in item.accessory" :key="index" v-else>
          <img :src="item.middleUrl || '../../assets/icon/img_head_default.png'" :data-src="item.url"/>
        </div>
      </div>
      <!--视频-->
      <div class="content-video" v-if="item.type === '视频'" @click.stop="playMovie">
        <div class="videoBOx" v-if="videoPlay"><i class="icon iconfont icon-play_vidio"></i></div>
        <video class="playVideo" width="416" height="234" controls v-if="movie" ref="video">
          <source :src="item.accessory[0].url" type="video/mp4">
          您的浏览器不支持 HTML5 video 标签，请升级浏览器或者更换浏览器。
        </video>
        <div class="placeholder" v-else>
        </div>
      </div>
      <!--文件，链接-->
      <div v-if="item.type === '链接' || item.type === '文件'">
        <file-box :item="item" :isFile="isFile" :fileType='fileType'></file-box>
      </div>
    </div>
    <div class="info-area" v-if="!personal">
      <div class="time-and-del">
        <span class="time">{{item.createdAt || item.punchCardTime}}</span>
        <span v-if="item.isSelf && isCourse" class="del-btn" @click.stop="edit">编辑</span>
        <span v-if="item.isSelf && !isCourse" class="del-btn" @click.stop="edit">删除</span>
      </div>
      <div class="operation">
        <!--点赞-->
        <div class="praise" @click.stop="praise">
          <img v-if="isfavor" class="icon-zan" src="@/assets/icon/bnt_zan_pre@3x.png" />
          <img v-else class="icon-zan" src="@/assets/icon/bnt_zan@3x.png" />
          <span>{{item.favorTotal>0 ? item.favorTotal : '' }}</span>
        </div>
        <!--评论-->
        <div class="comment" @click.stop="comment">
          <span class="icon-pinglun">
            <img src="@/assets/icon/bnt_comment@3x.png" />
          </span>
          <span>{{item.commentTotal>0? item.commentTotal : ''}}</span>
        </div>
      </div>
    </div>
    <div class="personalType" v-else>
      <div class="left">
        <span class="time">{{item.createdAt}}</span>
      </div>
      <div class="right">
        <span v-if="item.postType === 'jobcircleSection'">[圈]</span><span>{{item.jobCircleName}}</span>
      </div>
    </div>
    <template v-if="showCommunicate">
      <div class="comment-area" v-if="item.favorTotal > 0 || item.hotComments.length > 0">
        <div class="praise-block" :class="{'praise-block-marBot': item.hotComments.length > 0}" v-if="item.favorList.length > 0">
          <img class="icon-zan" src="./../../assets/icon/bnt_zan@3x.png" />
          <div class="praise-name">
            <span class="favor-name" v-for="(favor,favorIndex) in item.favorList" :key="favorIndex" @click.stop="toUserInfo(favor.uid)">{{favorIndex > 0 ?  ','+favor.realname : favor.realname}}</span>
          </div>
          <span class="praise-total" v-if="item.favorTotal > 3">等{{item.favorTotal}}人觉得很赞</span>
        </div>
        <div class="reply-block"  v-if="item.hotComments.length > 0">
          <template>
            <div class="hot-reply">
              <div class="hot-reply-icon">热门评论</div>
              <div class="reply" v-for="(reply,index) in item.hotComments" :key="index">
                <p class="favor-content"><span class="favor-name">{{reply.userName}}：</span>{{reply.content}}</p>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { getFavorApi, delFavorApi, setExcellentCourseCardApi } from '@/api/pages/course'
import { circleCommonFavorApi, delCircleCommonFavorApi, delCirclePostApi, circlePostToTopApi } from '@/api/pages/workCircle'
import fileBox from '@c/functional/fileBox'
export default {
  name: 'dynamicItem',
  components: {
    fileBox
  },
  props: {
    item: {
      type: Object
    },
    showBorder: {
      type: Boolean,
      default: true
    },
    showCommunicate: {
      type: Boolean,
      default: true
    },
    isCourse: {
      type: Boolean,
      default: true
    },
    openPreview: { // 是否开启图片预览
      type: Boolean,
      default: true
    },
    personal: { // 是否为个人中心的帖子
      type: Boolean,
      default: false
    },
    index: {
      type: Number
    }
  },
  watch: {
    item: {
      immediate: true,
      handler: function () {
        this.isfavor = this.item.isFavor
        this.item.type === '文件' ? this.isFile = true : this.isFile = false
        if (this.item.accessory && this.item.accessory.length > 0 && this.item.accessory[0].attachType === 'doc') {
          let result = this.item.accessory[0].fileName.match(/\.[^\.]+/)
          this.fileType = result[0]
        }
      }
    }
  },
  computed: {
  },
  data () {
    return {
      isfavor: false,
      movie: true, // 视频播放开关
      fileType: '', // 文件的类型xml，或者其他
      isFile: true, // 是否文件类型
      videoPlay: true
    }
  },
  methods: {
    /*  文字超过六行隐藏与展示 */
    isFullText (ref) {
      this.$nextTick(() => {
        const el = this.$refs[ref]
        if (el && el.firstChild) {
          const contentText = el.firstChild
          if (contentText.scrollHeight > contentText.offsetHeight) {
            const fullText = document.createElement('span')
            fullText.className = 'full-text open'
            fullText.innerText = '展开全文'
            fullText.onclick = (e) => {
              e.preventDefault()
              e.stopPropagation()
              if (fullText.innerText === '展开全文') {
                contentText.classList.remove('ellipsis')
                fullText.innerText = '收起全文'
                fullText.className = 'full-text close'
              } else {
                fullText.innerText = '展开全文'
                contentText.classList.add('ellipsis')
                fullText.className = 'full-text open'
              }
            }
            el.lastChild.innerHTML = ''
            el.lastChild.appendChild(fullText)
          } else {
            if (el.lastChild.firstChild) {
              el.lastChild.removeChild(el.lastChild.firstChild)
            }
          }
        }
      })
    },
    videoClick () {
      const itemIndex = this.itemIndex
      this.$emit('videoEvent', {
        eventType: 'play',
        itemIndex
      })
    },
    toDetail () {
      if (this.item.postType !== 'jobcircleSection') {
        this.$router.push({path: '/punchDetail', query: {id: this.item.courseSectionCardId}})
      } else {
        this.$router.push({path: '/postDetail', query: {id: this.item.id}})
      }
    },
    toUserInfo (userId) {
      this.$router.push({path: '/personalPage', query: {uid: userId}})
    },
    /*  点赞  */
    async praise () {
      if (this.item.postType !== 'jobcircleSection' && this.$route.path !== '/punchDetail') {
        this.$router.push({path: '/punchDetail', query: {id: this.item.courseSectionCardId}})
        return
      } else if (this.item.postType === 'jobcircleSection' && this.$route.path !== '/postDetail') {
        this.$router.push({path: '/postDetail', query: {id: this.item.id}})
        return
      }
      let param = {
        sourceId: this.item.courseSectionCardId || this.item.id,
        sourceType: 'course_section_card',
        circleSourceType: 'job_circle_post'
      }
      /* 点赞或取消点赞 */
      if (!this.isfavor) {
        // 点赞
        if (this.isCourse) { // 课节打卡点赞
          await getFavorApi(param)
        } else { // 工作圈打卡点赞
          await circleCommonFavorApi(param)
        }
        this.item.favorTotal += 1
        this.isfavor = true
      } else {
        // 取消点赞
        if (this.isCourse) { // 课节打卡取消点赞
          await delFavorApi(param)
        } else { // 工作圈打卡取消点赞
          await delCircleCommonFavorApi(param)
        }
        this.item.favorTotal -= 1
        this.isfavor = false
      }
    },
    /*  评论  */
    comment () {
      if (this.item.postType !== 'jobcircleSection' && this.$route.path !== '/punchDetail') {
        this.$router.push({path: '/punchDetail', query: {id: this.item.courseSectionCardId}})
      } else if (this.item.postType === 'jobcircleSection' && this.$route.path !== '/postDetail') {
        this.$router.push({path: '/postDetail', query: {id: this.item.id}})
        return
      }
      let param = {
        id: this.item.courseSectionCardId || this.item.id, // 打卡id
        releaseUser: this.item.releaseUser // 对应打卡信息的个人信息
      }
      this.$emit('disableOperationEvents', {
        eventType: 'comment',
        param
      })
    },
    /* 删除 */
    del () {
    },
    /* 编辑 */
    edit () {
      if (this.isCourse) {
        this.$router.push({path: '/punchEdit', query: {id: this.item.courseSectionId}})
      } else {
        let that = this
        this.$confirm({
          title: '确定删除',
          content: '确定删除帖子吗？',
          confirmBack () {
            delCirclePostApi(that.item.id).then(res => {
              that.$emit('delPost', {index: that.index})
              that.$toast({text: '删除帖子成功', type: 'success'})
            })
          }
        })
      }
    },
    /* 置顶帖子 */
    toTop () {
      if (this.isCourse) {
        this.$emit('setPostTop', this.item)
      } else {
        this.$emit('setPostTop', this.item)
      }
    },
    playMovie () {
      this.videoPlay = false
      this.$refs['video'].play()
    }
  },
  mounted () {}
}
</script>

<style lang="less" scoped>
  .bottomBorder{
    border-bottom: 0.5px solid #EDEDED;
  }
  .dynamicItem {
    box-sizing: border-box;
    width: 100%;
    padding: 25px 20px;
    .header {
      position: relative;
      display: flex;
      align-items: center;
      .topBox{
        position: absolute;
        right: 0px;
        top: 4px;
        display: flex;
        align-content: center;
        justify-content: center;
      }
      .headerPhoto {
        width: 32px;
        height: 32px;
        border: 0.5px solid #EDEDED;
        border-radius: 50%;
      }
      .appellation {
        margin-left: 8px;
        display: flex;
        align-items: center;
        color: #4080AD;
        font-size: 28px;/*px*/
        font-weight: 700;
      }
      .isTopping{
        width: 20px;
        height: 20px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .evaluate{
        width: 30px;
        font-size: 30px;
        line-height: 10px;
        color: #DBDBDB;
        writing-mode: tb-rl;
        white-space: nowrap;
        margin-left: 5px;
        /*position:absolute;
        right: -10px;
        top: 5px;*/
        .evaluateWindow{
          background-color: #FFFFFF;
          writing-mode: lr-tb;
          position: absolute;
          top: 100%;
          right: 0;
          font-size: 16px;
          color: #354048;
          z-index: 777;
          box-shadow:0px 4px 10px 0px rgba(0,0,0,0.14);
          border-radius:3px;
          span{
              display: inline-block;
              width: 134px;
              height: 55px;
              text-align: center;
              line-height: 55px;
              border-bottom: 0.5px solid #EDEDED;
              &::first-child{
                  border-bottom: 0.5px solid #EDEDED;
              }
          }
        }
      }
    }
    /*内容部分*/
    .content {
      .content-text {
        width: 100%;
        font-weight: 300;
        font-size: 30px;/*px*/
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        /*文本超出省略*/
        &.ellipsis {
          -webkit-line-clamp: 6;
        }
        margin-top: 10px;
        word-break: break-all;
        word-wrap: break-word;
        line-height: 1.5;
        color: #354048;
        white-space: pre-line;
      }
      .full-text-btn {
        margin-top: 6px;
        font-size: 30px;/*px*/
        color: #4080ad;
        font-weight: 300;
        line-height: 19px;
      }
      /*  图片部分  */
      .content-images {
        margin-top: 3px;
        width: 100%;
        display: flex;
        flex-flow: row wrap;
        .item-image {
          margin-top: 5px;
          margin-left: 5px;
          width: 108px;
          height: 108px;
          text-align: center;
          flex-grow:0;
          &:first-of-type,
          &:nth-of-type(3n + 1) {
            margin-left: 0;
          }
          img {
            object-fit: cover;
            background: #f9f9f9;
            width: 100%;
            height: 100%;
            vertical-align: middle;
          }
        }
        .item-image.one {
          width: 136px;
          height: 136px;
        }
        .item-image.four {
          width: 108px;
          height: 108px;
          margin-left: 5px;
          &:nth-of-type(2n+1){
            margin-left: 0;
          }
          &:nth-of-type(2n){
            margin-right: 108px;
          }
        }
      }
      /*  视频部分  */
      .content-video {
        width: 335px;
        height: 187px;
        margin-top: 5px;
        position: relative;
        display: inline-block;
        .videoBOx{
          box-sizing: border-box;
          width: 335px;
          height: 187px;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 9998;
          background-color: #000000;
          i{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%);
            font-size: 50px;
            color: #FFFFFF;
            z-index: 9999;
          }
        }
        .playVideo{
          background-color: #000000;
          height: 187px;
        }
        .placeholder {
          width: 335px;
          height: 187px;
          background: rgba(0, 0, 0, .8) url('~@/assets/icon/video-play.png') no-repeat center;
          background-size: 17.5px 17.5px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        video {
          background: #000000;
          width: 100%;
          height: 187px;
        }
      }
    }
    /*底部区域*/
    .info-area{
      display: flex;
      margin-top: 20px;
      justify-content: space-between;
      align-items: center;
      font-size: 24px;/*px*/
      line-height: 8.5px;
      color: #929292;
      /*评论和点赞按钮*/
      .operation {
        display: flex;
        align-items: center;
        flex: 0 0 auto;
        .praise,
        .comment {
          display: flex;
          align-items: center;
          height: 17px;
          font-size: 24px;/*px*/
          color: #354048;
          line-height: 1;
          padding: 0 2px;
          img{
            width: 17px;
            margin-right: 4px;
          }
        }
        .comment {
          margin-left: 29px;
        }
      }
      /*时间和删除按钮*/
      .time-and-del{
        .time{
          color: #666666;
        }
        .del-btn {
          color: #576b95;
          margin-left: 10px;
        }
      }
    }
    .personalType {
      margin-top: 15px;
      overflow: hidden;
      font-size: 24px; /*px*/
      font-weight: 300;
      color: #666666;
      .left {
        float: left;
      }
      .right {
        text-align: right;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        width: 201px;
        float: right;
      }
    }
    .comment-area {
      background: #F8F8F8;
      margin-top: 15px;
      padding: 8px 10px;
      /*点赞信息*/
     .praise-block {
        padding: 2.5px 0;
        font-size: 28px;/*px*/
        display: flex;
        align-items: center;
        .icon-zan{
          width: 15px;
          height: 15px;
        }
        .praise-total {
          width: 140px;
          font-weight: 300;
          color: #354048;
        }
        .praise-name {
          color: #4080AD;
          font-weight: 700;
          margin: 0 6px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
      }
      .praise-block-marBot{
        margin-bottom: 10px;
      }
      /*评论区域*/
      .reply-block {
        padding: 5px 0;
        .reply {
          display: -webkit-box;
          font-size: 28px;/*px*/
          font-weight: 300;
          margin-top: 5px;
          .favor-name {
            font-size: 28px;/*px*/
            font-weight: 700;
            color: #4080AD;
          }
          &:nth-of-type(1) {
            margin-top: 8px;
          }
          .ellipsis3{
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow:ellipsis;
            -webkit-line-clamp: 2;
          }
        }
        /*热评标志样式*/
        .hot-reply {
          .hot-reply-icon {
            width: 80px;
            height: 20px;
            padding: 0 0 0 8px;
            background: #FFE266;
            border-radius: 0px 50px 50px 0px;
            text-align: center;
            line-height: 18px;
            font-size: 28px;/*px*/
            color:#354048;
            position: relative;
            &::before {
              content: '';
              width: 20px;
              height: 20px;
              position: absolute;
              left: -4px;
              top: 0;
              background: url(../../assets/icon/icon_hotcomment@3x.png) no-repeat;
              background-size: 100% 100%;
            }
          }
          .more-content{
            display: -webkit-inline-box;
            font-size: 28px;/*px*/
            color: #4080AD;
          }
        }
        /*热评标志样式*/
      }
      /*评论区域结束*/
    }
  }
</style>