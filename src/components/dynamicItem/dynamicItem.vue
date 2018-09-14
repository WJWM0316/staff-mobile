<template>
  <div class="dynamicItem" :class="{bottomBorder : showBorder}" @click="toDetail">
    <div class="header" @click.stop="toUserInfo">
      <img class="headerPhoto" src="http://thirdwx.qlogo.cn/mmopen/ajNVdqHZLLBNL2BQhCZO1J8VcvQp5xBf38Ufarf6r2VYyTic5ciaTY4QXAPzibOzuZD9cM56FXpxPgjyDVhO9FhqQ/132" />
      <div class="appellation">我是谁，我在哪里</div>
    </div>
    <!--内容区-->
    <div class="content">
      <!--1.纯文本-->
      <!--限制六行-->
      <div ref="circle-content">
        <p class="content-text ellipsis">我是很长很长的文字，我会超出范围。我是很长很长的文字，我会超出范围。我是很长很长的文字，我会超出范围。我是很长很长的文字，我会超出范围。我是很长很长的文字，我会超出范围。我是很长很长的文字，我会超出范围。我是很长很长的文字，我会超出范围。我是很长很长的文字，我会超出范围。我是很长很长的文字，我会超出范围。我是很长很长的文字，我会超出范围。我是很长很长的文字，我会超出范围。</p>
        <p class="full-text-btn">{{isFullText('circle-content')}}</p>
      </div>
      <!--2.图片-->
      <div class="content-images" v-if="picList.length > 0">
        <!--  图片为 1 张时  -->
        <div class="item-image one" v-if="picList.length === 1">
          <img :src="picList[0].fileUrl || '../../assets/icon/img_head_default.png'" />
        </div>
        <!--  图片为 多 张时  -->
        <div class="item-image" v-for="(item,index) in picList" :key="index" v-else>
          <img :src="item.fileUrl || '../../assets/icon/img_head_default.png'" />
        </div>
      </div>
      <!--  视频-->
      <div class="content-video" v-if="false">
        <video controls ref="video" v-show="false"></video>
        <div class="placeholder">
          <!--背景图-->
          <!--<img />-->
        </div>
      </div>
      <!-- 文件 -->
      <div>
        <div class="content-file" @click.stop="fileOpen('https://cdnstatic.ziwork.com/test/file/2018-05-29/4475f3474790d39f9e051b46480fea02.xlsx')">
          <img class="file-logo" src="./../../assets/suffix/pdf.png" />
          <!--<img class="file-logo" src="./../../assets/suffix/ppt.png" />
          <img class="file-logo" src="./../../assets/suffix/word.png" />
          <img class="file-logo" src="./../../assets/suffix/xls.png" />
          <img class="file-logo" src="" />-->

          <div class="file-desc">
            <p class="text">薛兆丰30年职场经验分享，字超过打点字超过打点字超过打点字超过打点字超过打点字超过打点</p>
            <p class="text">35K</p>
          </div>
        </div>
      </div>
    </div>
    <!--  内容区结束  -->
    <!--  底部区   -->
      <div class="info-area">
        <div class="time-and-del">
          <span class="time">{{timeStr}}</span>
          <span class="del-btn" @click.stop="del">删除</span>
        </div>
        <div class="operation">
          <!-- 点赞按钮 -->
          <div class="praise" @click.stop="praise">
            <img v-if="false" class="icon-zan" src="./../../assets/icon/bnt_zan_pre@3x.png" />
            <img v-else class="icon-zan" src="./../../assets/icon/bnt_zan@3x.png" />
            <span>1</span>
          </div>
          <!-- 评论按钮 -->
          <div class="comment" @click.stop="comment">
            <span class="icon-pinglun">
              <img src="./../../assets/icon/bnt_comment@3x.png" />
            </span>
            <span>1</span>
          </div>
        </div>
      </div>
    <template v-if="showCommunicate">
      <div class="comment-area">
        <!-- 点赞信息 -->
        <div class="praise-block" v-if="true">
          <img class="icon-zan" src="./../../assets/icon/bnt_zan@3x.png" />
          <div class="praise-name">
            <span class="favor-name" v-for="(favor,favorIndex) in favors" :key="favorIndex" @click.stop="toUserInfo(favor.userId)">{{favorIndex > 0 ?  ','+favor.realName : favor.realName}}</span>
          </div>
          <span class="praise-total" v-if="favors.length > 3">等{{favors.length}}人觉得很赞</span>
        </div>
        <!-- 评论信息 -->
        <div class="reply-block">
          <template  v-if="true">
            <div class="hot-reply">
              <div class="hot-reply-icon">热门评论</div>
              <div class="reply" v-for="(reply,index) in comments" :key="index">
                <p class="favor-content ellipsis3"><span class="favor-name">{{reply.reviewer.realName}}：</span>{{reply.content}}</p>
              </div>
            </div>
          </template>
          <!--<tempalte v-else>
            <div class="reply ellipsis3" v-for="reply in item.comments">
              <span class="favor-name" @click.stop="toUserInfo(reply.userId)">{{reply.reviewer.realName}}</span>: {{reply.content}}
            </div>
            <div class="reply" v-if="item.commentTotal > 3">
              <span class="favor-name">查看全部{{item.commentTotal}}条回复</span>
            </div>
          </tempalte>-->
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'dynamicItem',
  props: {
    showBorder: {
      type: Boolean,
      default: true
    },
    showCommunicate: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    // 朋友圈发表时间展示规则
    timeStr () {
      let releaseTime = 1527576536 || 0
      const now = this.serverTime ? new Date(this.serverTime * 1000) : new Date()
      let timeStr = '刚刚'
      if (releaseTime) {
        releaseTime = new Date(releaseTime * 1000)
        let differ = parseInt((now.getTime() - releaseTime.getTime()) / 1000)
        const timeCompany = {
          m: 60,
          h: 60 * 60,
          d: 60 * 60 * 24
        }

        // 是否跨年 and 超过两天
        const nowDate = {
          y: now.getFullYear(),
          m: now.getMonth(),
          d: now.getDate()
        }
        const releaseTimeDate = {
          y: releaseTime.getFullYear(),
          m: releaseTime.getMonth(),
          d: releaseTime.getDate()
        }
        // 是否当天
        if (nowDate.y === releaseTimeDate.y && nowDate.m === releaseTimeDate.m && nowDate.d === releaseTimeDate.d) {
          if (differ < timeCompany.m) { // 一分钟以内
            timeStr = '刚刚'
          } else if (differ < timeCompany.h) { // 一小时以内
            timeStr = parseInt(differ / timeCompany.m) + '分钟前'
          } else {
            timeStr = parseInt(differ / timeCompany.h) + '小时前'
          }
        } else {
          differ = parseInt((new Date(nowDate.y, nowDate.m, nowDate.d).getTime() - releaseTime.getTime()) / 1000)
          if (differ < timeCompany.d) { // 昨天
            timeStr = '昨天'
          } else if (differ < timeCompany.d * 2) {
            timeStr = '前天'
          } else {
            if (now.getFullYear() > releaseTime.getFullYear()) { // 超过两天且跨年
              timeStr = moment(releaseTime).format('YY-MM-DD HH:mm')
            } else {
              timeStr = moment(releaseTime).format('MM-DD HH:mm')
            }
          }
        }
      }
      return timeStr
    }
  },
  data () {
    return {
      favors: [
        {realName: 'S好'},
        {realName: 'S好'},
        {realName: 'S好'},
        {realName: 'S好'}
      ],
      comments: [
        {
          commentId: 85,
          commentTotal: 5,
          content: '注意每条之间的间距，和每条评论的行间距注意每条之间的间距，和每条评论的行间距',
          favorTotal: 2,
          isFavor: 1,
          isHot: 1,
          isNew: 1,
          isSelf: 0,
          peopleCourseId: 1020,
          releaseTime: 1534574115,
          reviewer: {
            avatar: 'http://thirdwx.qlogo.cn/mmopen/BMibibqZYibkicaJicQQ3zlN78Ibr0Xa8Fk6yt3zjvavI9Vgb5RjiarPAjJWAwkqMukJq8oicNyH7Pibzs9TDBG3PMMkWgPetlAdj42o/132',
            avatarUrl: 'http://thirdwx.qlogo.cn/mmopen/BMibibqZYibkicaJicQQ3zlN78Ibr0Xa8Fk6yt3zjvavI9Vgb5RjiarPAjJWAwkqMukJq8oicNyH7Pibzs9TDBG3PMMkWgPetlAdj42o/132',
            realName: 'LeonW'
          }
        },
        {
          commentId: 85,
          commentTotal: 5,
          content: '好厉害～',
          favorTotal: 2,
          isFavor: 1,
          isHot: 1,
          isNew: 1,
          isSelf: 0,
          peopleCourseId: 1020,
          releaseTime: 1534574115,
          reviewer: {
            avatar: 'http://thirdwx.qlogo.cn/mmopen/BMibibqZYibkicaJicQQ3zlN78Ibr0Xa8Fk6yt3zjvavI9Vgb5RjiarPAjJWAwkqMukJq8oicNyH7Pibzs9TDBG3PMMkWgPetlAdj42o/132',
            avatarUrl: 'http://thirdwx.qlogo.cn/mmopen/BMibibqZYibkicaJicQQ3zlN78Ibr0Xa8Fk6yt3zjvavI9Vgb5RjiarPAjJWAwkqMukJq8oicNyH7Pibzs9TDBG3PMMkWgPetlAdj42o/132',
            realName: 'LeonW'
          }
        }
      ],
      picList: [
        /*  {
          duration: 0,
          fileId: 6838,
          fileName: 'JPMHUm1g5-99_T2oS2xcsoa-lX46gKL_MfdYMepP7om8hSx6NZhG3rHc2jngYMA6.jpg',
          fileUrl: 'https://cdnstatic.ziwork.com/test/image/2018-08-17/db182d64f8e393c21d6b1a09863cd124.jpg',
          imgHeight: 0,
          imgWidth: 0,
          isPlayed: true,
          size: 126295
        },
        {
          duration: 0,
          fileId: 6838,
          fileName: 'JPMHUm1g5-99_T2oS2xcsoa-lX46gKL_MfdYMepP7om8hSx6NZhG3rHc2jngYMA6.jpg',
          fileUrl: 'https://cdnstatic.ziwork.com/test/image/2018-08-17/db182d64f8e393c21d6b1a09863cd124.jpg',
          imgHeight: 0,
          imgWidth: 0,
          isPlayed: true,
          size: 126295
        },
        {
          duration: 0,
          fileId: 6838,
          fileName: 'JPMHUm1g5-99_T2oS2xcsoa-lX46gKL_MfdYMepP7om8hSx6NZhG3rHc2jngYMA6.jpg',
          fileUrl: 'https://cdnstatic.ziwork.com/test/image/2018-08-17/db182d64f8e393c21d6b1a09863cd124.jpg',
          imgHeight: 0,
          imgWidth: 0,
          isPlayed: true,
          size: 126295
        },
        {
          duration: 0,
          fileId: 6838,
          fileName: 'JPMHUm1g5-99_T2oS2xcsoa-lX46gKL_MfdYMepP7om8hSx6NZhG3rHc2jngYMA6.jpg',
          fileUrl: 'https://cdnstatic.ziwork.com/test/image/2018-08-17/db182d64f8e393c21d6b1a09863cd124.jpg',
          imgHeight: 0,
          imgWidth: 0,
          isPlayed: true,
          size: 126295
        } */
      ]
    }
  },
  methods: {
    /*  文字超过六行隐藏与展示 */
    isFullText (ref) {
      this.$nextTick(() => {
        console.log(111111111111)
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
            // 删除倒叙后不符合条件的展开全文标识
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
    /*  打开文件  */
    fileOpen (url) {
      window.location.href = url
    },
    /*  -----------------------跳转交互方法----------------------------  */
    /*  去帖子详情  */
    toDetail () {
      console.log(' 去详情页 ')
      this.$router.push(`/course/detail`)
    },
    /* 跳转个人详情页 */
    toUserInfo (userId) {
      if (this.disableUserClick) {
        return
      }
      this.$router.push(`/userInfo/${userId}/details`)
    },
    /*  点赞  */
    praise () {
      console.log(' 我是点赞事件 ')
    },
    /*  评论  */
    comment () {
      console.log(' 我是评论事件 ')
    },
    /* 删除 */
    del () {
      console.log(' 我是删除事件 ')
    }
  },
  mounted () {
    console.log(222222222222222)
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