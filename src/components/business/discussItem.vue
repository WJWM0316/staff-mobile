<template>
  <div class="discussItem" v-if="item">
    <!-- 头像 -->
    <div class="left">
      <img v-if="item.userAvatar" :src="item.userAvatar.smallUrl" class="user-image" @click.stop="toUserInfo(item.uid)" />
    </div>
    <div class="right" :class="{border: isShowBorder}">
      <div class="content-head">
        <div class="user-box">
          <div>
            <!-- 用户名 -->
            <p class="user-name master" @click.stop="toUserInfo(item.uid)">{{item.userName}}</p>
            <!-- 用户头衔 -->
            <p class="user-career" v-if="item.userTitle">{{item.userTitle}}</p>
          </div>
        </div>
      </div>
      <!-- 内容区分 -->
      <!-- -------------------------------------------------------------- -->
      <!-- 评论类型 -->
      <!-- 发表内容 类型: 指定回复人 无指定回复人 -->
      <div class="publish-content">
        <!-- 指定回复人 -->
        <p class="content-text" v-if="item.ancestorCommentId !== item.parentCommentId">回复<span style="color: #4080AD; display: inline-block; z-index: 9;" @click.stop="toUserInfo(item.uid)">{{item.toUserName}}</span>：{{item.content}}</p>
        <!-- 无指定回复人 -->
        <p class="content-text" v-else>{{item.content}}</p>
      </div>
      <!------------------------------------------------------>
      <!-- 尾部 -->
      <div class="info-area">
        <div>
          <span>{{item.createdAt}}</span>
          <span v-if="item.isOwner === 1 && showDel" class="del-btn" @click.stop="del">删除</span>
        </div>
        <div class="operation">
          <!-- 点赞按钮 -->
          <div class="praise" v-if="true" @click.stop="praise">
            <img v-if="item.isFavor === 1" class="icon-zan" src="./../../assets/icon/bnt_zan_pre@3x.png" />
            <img v-else class="icon-zan" src="./../../assets/icon/bnt_zan@3x.png" />
            {{item.favorCount > 0? item.favorCount : ''}}
          </div>
          <!-- 评论按钮 -->
          <div class="comment" v-if="true" @click.stop="comment">
            <img class="icon-pinglun" src="./../../assets/icon/bnt_comment@3x.png" />
            {{item.commentCount > 0? item.commentCount : ''}}
          </div>
        </div>
      </div>
      <!-- 评论区 -->
      <div class="comment-area" v-if="(item.replyCount > 0 || item.favorCount > 0) && isShowComment" @click="commentAreaClick">
        <!-- 点赞信息 -->
        <div class="praise-block" v-if="item.favorCount > 0">
          <img class="icon-zan" src="@/assets/icon/bnt_zan@3x.png" />
          <div class="praise-name">
            <span class="favor-name" v-for="(favor, favorIndex) in item.favorUsers" :key="favorIndex" @click.stop="toUserInfo(favor.uid)">{{favorIndex > 0 ?  ','+favor.realname : favor.realname}}</span>
          </div>
          <span class="praise-total" v-if="item.favorCount > 3">等{{item.favorCount}}人觉得很赞</span>
        </div>
        <!-- 评论信息 -->
        <div class="reply-block" v-if="item.replyCount > 0">
          <div class="reply" v-for="(reply,index) in item.replyCommentList" :key="index">
            <div v-if="reply.ancestorCommentId !== reply.parentCommentId">
              <p>
                <span class="favor-name" @click.stop="toUserInfo(reply.uid)">{{reply.userName}}</span> 回复 <span class="favor-name" @click.stop="toUserInfo(reply.toUid)">{{reply.toUserName}}</span>：{{reply.content}}
              </p>
            </div>
            <div v-else>
              <div>
                <p v-if="true"><span class="favor-name" @click.stop="toUserInfo(reply.uid)">{{reply.userName}}</span>: {{reply.content}}</p>
                <p v-else><span class="favor-name" @click.stop="toUserInfo(reply.uid)">{{reply.reviewer.realName}}</span>: {{reply.content}}</p>
              </div>
            </div>
          </div>
          <div class="reply" v-if="item.replyCount > 3">
            <span class="favor-name" @click.stop="comment">查看全部{{item.replyCount}}条回复</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getFavorApi, delFavorApi, delCommentApi } from '@/api/pages/course'
import { circleCommonFavorApi, delCircleCommonFavorApi, delCircleCommentApi } from '@/api/pages/workCircle'
export default {
  name: 'discussItem',
  props: {
    isShowBorder: {
      type: Boolean,
      default: true
    },
    item: {
      type: Object
    },
    index: {
      type: Number
    },
    isCourse: {
      type: Boolean,
      default: true
    },
    showDel: {
      type: Boolean,
      default: true
    },
    isShowComment: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      favorList: []
    }
  },
  computed: {
    // 朋友圈发表时间展示规则
    timeStr () {
      // let releaseTime = this.item.releaseTime || 0
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
  methods: {
    // 点击评论事件
    commentAreaClick () {
      console.log(' 我是底部评论区点击评论事件 ')
    },
    toUserInfo (id) {
      console.log(id)
      this.$router.push({path: '/personalPage', query: {uid: id}})
    },
    comment () {
      if (this.$route.path !== '/commentDetail') {
        this.$router.push({path: '/commentDetail', query: {id: this.item.id, isCourse: this.isCourse ? 'true' : 'false'}})
        return
      }
      let param = {
        id: this.item.id, // 评论的id
        name: this.item.userName
      }
      this.$emit('disableOperationEvents', {
        eventType: 'comment',
        param
      })
    },
    async praise () {
      let param = {
        id: this.item.id,
        sourceId: this.item.id,
        sourceType: 'course_section_card_comment',
        circleSourceType: 'job_circle_comment'
      }
      if (this.item.isFavor === 0) {
        if (this.isCourse) { // 课程点赞
          await getFavorApi(param, false)
        } else { // 工作圈点赞
          await circleCommonFavorApi(param, false)
        }
        this.item.isFavor = 1
        this.item.favorCount += 1
        if (!this.item.favorUsers) this.item.favorUsers = []
        this.item.favorUsers.push({realname: this.item.currentUserInfo.realname})
      } else {
        if (this.isCourse) {
          await delFavorApi(param, false)
        } else {
          await delCircleCommonFavorApi(param, false)
        }
        this.item.isFavor = 0
        this.item.favorCount -= 1
        let that = this
        this.item.favorUsers.map(function (item, index) {
          if (item.realname === that.item.currentUserInfo.realname) {
            that.item.favorUsers.splice(index, 1)
            console.log(that.item.currentUserInfo.realname, index)
          }
        })
      }
    },
    async del () {
      if (!this.isCourse) {
        await delCircleCommentApi(this.item.id)
      } else {
        await delCommentApi(this.item.id)
      }
      this.$toast({text: '评论已删除', type: 'success'})
      this.$emit('delComment', {index: this.index})
    }
  },
  created () {}
}
</script>

<style lang="less" scoped>
.discussItem{
  display: flex;
  flex-wrap: wrap;
  padding:  15px 0;
  .left{
    height: 100%;
    .user-image{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border:0.5px solid #EDEDED;
    }
  }
  /*右边模块*/
  .right {
    box-sizing: border-box;
    padding-bottom: 15px;
    padding-left: 15px;
    flex-grow: 1;
    font-size: 30px;/*px*/
    width: 280px;
    .content-text{
      word-wrap: break-word;
      font-size: 30px;/*px*/
    }
    .content-head{
      color: #4080AD;
      font-size: 28px;/*px*/
      padding-bottom: 5px;
      .user-career{
        font-size: 24px;/*px*/
      }
    }
    &.border {
      border-bottom: solid 1px #ededed; /*px*/
    }
    .info-area {
      display: flex;
      margin-top: 12.5px;
      justify-content: space-between;
      font-size: 24px;/*px*/
      font-weight: 300;
      align-items: center;
      color: #929292;
      .operation {
        display: flex;
        flex: 0 0 auto;
        .praise , .comment{
          font-size: 12px;
          font-weight: 300;
          color: #354048;
          line-height: 1;
          display: flex;
          align-items: center;
          padding: 0 2px;
          margin-right: 30px;
          img{
            width: 17px;
            height: 17px;
            margin-right: 4px;
          }
        }
        .comment{
          margin-right: 0;
        }
      }
      .del-btn {
        color: #4080AD;
        margin-left: 5px;
      }
    }
    /* 评论区 */
    .comment-area {
      display: inline-block;
      margin-top: 6px;
      padding: 2px 5px;
      width: 100%;
      border-radius: 2px;
      background-color: #f8f8f8;
      box-sizing: border-box;
      font-size: 13px;/*px*/
      .praise-block {
        padding: 9px 0 7px;
        display: flex;
        box-sizing: border-box;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        .icon-zan{
          width: 15px;
          height: 16px;
          margin-right: 6px;
        }
        .praise-total {
          font-size: 28px;/*px*/
          font-weight: 300;
          flex: 0 0 auto;
        }
        .praise-name {
          font-size: 28px;/*px*/
          font-weight: 700;
          flex-grow: 1;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
      }
      .reply-block {
        font-size: 28px;/*px*/
        padding: 2.5px 0;
        .reply {
          margin-top: 2px;
        }
        .reply:first-of-type {
          margin-top: 0;
        }
      }
      .favor-name {
        font-weight: bold;
        color: #4080AD;
      }
    }
  }
}
</style>