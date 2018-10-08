<template>
  <div class="dynamicItem" :class="{bottomBorder : showBorder}" @click="toDetail">
    <div class="header" @click.stop="toUserInfo">
      <img class="headerPhoto" v-if="item.releaseUser" :src="item.releaseUser.avatar.smallUrl" />
      <div class="appellation" v-if="item.releaseUser">{{item.releaseUser.realname}}</div>
      <!--置顶按钮-->
      <div class="evaluate" @click.stop="toTop">...</div>
    </div>
    <div class="content">
      <div ref="circle-content">
        <p class="content-text ellipsis">{{item.cardContent}}</p>
        <p class="full-text-btn">{{isFullText('circle-content')}}</p>
      </div>
      <div class="content-images" v-if="item.cardContentFile && item.cardContentFile.length > 0">
        <div class="item-image one" v-if="item.cardContentFile.length === 1">
          <img :src="item.cardContentFile[0].url || '../../assets/icon/img_head_default.png'" />
        </div>
        <div class="item-image" v-for="(item,index) in item.cardContentFile" :key="index" v-else>
          <img :src="item.url || '../../assets/icon/img_head_default.png'" />
        </div>
      </div>
      <div class="content-video" v-if="false">
        <video controls ref="video" v-show="false"></video>
        <div class="placeholder">
        </div>
      </div>
      <!-- 文件 -->
      <div v-if="false">
        <div class="content-file" @click.stop="fileOpen('https://cdnstatic.ziwork.com/test/file/2018-05-29/4475f3474790d39f9e051b46480fea02.xlsx')">
          <img class="file-logo" src="./../../assets/suffix/pdf.png" />
          <div class="file-desc">
            <p class="text">薛兆丰30年职场经验分享，字超过打点字超过打点字超过打点字超过打点字超过打点字超过打点</p>
            <p class="text">35K</p>
          </div>
        </div>
      </div>
    </div>
      <div class="info-area">
        <div class="time-and-del">
          <span class="time">{{item.createdAt}}</span>
          <span v-if="item.isSelf" class="del-btn" @click.stop="edit">编辑</span>
        </div>
        <div class="operation">
          <div class="praise" @click.stop="praise">
            <img v-if="isfavor" class="icon-zan" src="@/assets/icon/bnt_zan_pre@3x.png" />
            <img v-else class="icon-zan" src="@/assets/icon/bnt_zan@3x.png" />
            <span>{{item.favorTotal}}</span>
          </div>
          <div class="comment" @click.stop="comment">
            <span class="icon-pinglun">
              <img src="@/assets/icon/bnt_comment@3x.png" />
            </span>
            <span>{{item.commentTotal}}</span>
          </div>
        </div>
      </div>
    <template v-if="showCommunicate">
      <div class="comment-area" v-if="item.favorList.length > 0 && item.hotComments.length > 0">
        <div class="praise-block" v-if="item.favorList.length > 0">
          <img class="icon-zan" src="./../../assets/icon/bnt_zan@3x.png" />
          <div class="praise-name">
            <span class="favor-name" v-for="(favor,favorIndex) in item.favorList" :key="favorIndex" @click.stop="toUserInfo(favor.userId)">{{favorIndex > 0 ?  ','+favor.realname : favor.realname}}</span>
          </div>
          <span class="praise-total" v-if="item.favorList.length > 3">等{{item.favors.length}}人觉得很赞</span>
        </div>
        <div class="reply-block">
          <template  v-if="item.hotComments.length > 0">
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
import { getFavorApi, delFavorApi } from '@/api/pages/course'
import { circleCommonFavorApi, delCircleCommonFavorApi } from '@/api/pages/workCircle'
export default {
  name: 'dynamicItem',
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
    }
  },
  watch: {
    item: {
      immediate: true,
      handler: function () {
        this.isfavor = this.item.isFavor
      }
    }
  },
  computed: {
  },
  data () {
    return {
      isfavor: false
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
    fileOpen (url) {
      window.location.href = url
    },
    toDetail () {
      if (this.isCourse) {
        this.$router.push({path: '/punchDetail', query: {myPunch: this.item.courseSectionCardId}})
      } else {
        console.log(this.item)
        this.$router.push({path: '/postDetail', query: {id: this.item.id}})
      }
    },
    toUserInfo (userId) {
      if (this.disableUserClick) {
      }
    },
    /*  点赞  */
    async praise () {
      let param = {
        sourceId: this.item.courseSectionCardId || this.item.id,
        sourceType: 'course_section_card',
        circleSourceType: 'job_circle_post'
      }
      /* 点赞或取消点赞 */
      if (this.isfavor !== true) {
        if (this.isCourse) { // 课节打卡点赞
          await getFavorApi(param)
        } else { // 工作圈打卡点赞
          await circleCommonFavorApi(param)
          this.item.favorTotal += 1
        }
        this.isfavor = true
      } else {
        if (this.isCourse) { // 课节打卡取消点赞
          await delFavorApi(param)
        } else { // 工作圈打卡取消点赞
          await delCircleCommonFavorApi(param)
          this.item.favorTotal -= 1
        }
        this.isfavor = false
      }
    },
    /*  评论  */
    comment () {
      if (this.isCourse && this.$route.path !== '/punchDetail') {
        this.$router.push({path: '/punchDetail', query: {myPunch: this.item.courseSectionCardId}})
      } else if (!this.isCourse && this.$route.path !== '/postDetail') {
        this.$router.push({path: '/postDetail', query: {id: this.item.id}})
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
      let { courseId } = this.$route.query
      this.$router.push({path: '/punchEdit', query: {courseSectionId: courseId}})
    },
    /* 置顶帖子 */
    toTop () {}
  },
  mounted () {
    console.log(this.isfavor)
  }
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
        font-weight: 500;
      }
      .evaluate{
        width: 30px;
        height: 30px;
        font-size: 30px;
        color: #DBDBDB;
        writing-mode: tb-rl;
        white-space: nowrap;
        position:absolute;
        right: -14px;
        top: 5px;
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
        font-weight: 400;
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
      }
      /*  视频部分  */
      .content-video {
        margin-top: 5px;
        position: relative;
        display: inline-block;
        .placeholder {
          width: 335px;
          height: 187px;
          background: rgba(0, 0, 0, .8) url('./../../assets/icon/video-play.png') no-repeat center;
          background-size: 17.5px 17.5px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        video {
          width: 100%;
        }
      }
      /*  文件  */
      .content-file {
        margin-top: 10px;
        display: flex;
        align-items: center;
        background-color: #F8F8F8;
        padding: 7.5px 10px 8.5px;
        border-radius: 3px;
        .file-logo {
          width: 44px;
          height: 44px;
          border-radius: 3px;
        }
        .file-desc {
          font-size: 14px;/*px*/
          color: #111111;
          margin-left: 10px;
          .text {
            font-size: 26px;/*px*/
            font-weight: 400;
            display: block;
            max-width: 261px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          .text:last-of-type {
            font-weight: 400;
            margin-top: 1px;
            color: #bcbcbc;
          }
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
          margin-left: 15px;
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
    .comment-area{
      background: #F8F8F8;
      margin-top: 15px;
      padding: 8px 10px;
      /*点赞信息*/
     .praise-block {
        padding: 2.5px 0;
        margin-bottom: 10px;
        font-size: 28px;/*px*/
        display: flex;
        align-items: center;
        .icon-zan{
          width: 15px;
          height: 15px;
        }
        .praise-total {
          font-weight: 300;
          color: #354048;
        }
        .praise-name {
          color: #4080AD;
          font-weight: 500;
          margin: 0 6px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
      }
      /*评论区域*/
      .reply-block {
        padding: 5px 0;
        .reply {
          font-size: 28px;/*px*/
          font-weight: 300;
          margin-top: 5px;
          .favor-name {
            font-size: 28px;/*px*/
            font-weight: 500;
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
        }
        /*热评标志样式*/
      }
      /*评论区域结束*/
    }
  }
</style>