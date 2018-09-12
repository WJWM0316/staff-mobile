<template>
  <div class="discussItem">
    <!-- 头像 -->
    <div class="left">
      <img src="http://thirdwx.qlogo.cn/mmopen/ajNVdqHZLLBNL2BQhCZO1J8VcvQp5xBf38Ufarf6r2VYyTic5ciaTY4QXAPzibOzuZD9cM56FXpxPgjyDVhO9FhqQ/132" class="user-image" @click.stop="toUserInfo(item.reviewer.userId)" />
    </div>
    <div class="right" :class="{border: isShowBorder}">
      <div class="content-head">
        <div class="user-box" v-if="true">
          <div>
            <!-- 用户名 -->
            <p class="user-name master" @click.stop="toUserInfo(item.reviewer.userId)">我是谁，我在哪</p>
            <!-- 用户头衔 -->
            <p class="user-career" v-if="false">我是头衔</p>
          </div>
        </div>
        <div class="other-box" v-else>
          <div>
            <!-- 用户名 -->
            <span class="user-name guest" @click.stop="toUserInfo(item.reviewer.userId)">我是谁，我在哪</span>
            <!-- 用户头衔 -->
          </div>
        </div>
      </div>
      <!-- 内容区分 -->
      <!-- -------------------------------------------------------------- -->
      <!-- 评论类型 -->
      <!-- 发表内容 类型: 指定回复人 无指定回复人 -->
      <div class="publish-content">
        <!-- 指定回复人 -->
        <p class="content-text" v-if="true">回复<span style="color: #4080AD; display: inline-block; z-index: 9;" @click.stop="toUserInfo(item.receiver.userId)">我是指定回复人的名称</span>：我是回复的内容</p>
        <!-- 无指定回复人 -->
        <p class="content-text" v-else>我是没有指定回复人的内容</p>
      </div>
      <!------------------------------------------------------>
      <!-- 尾部 -->
      <div class="info-area">
        <div>
          <span>{{timeStr}}</span>
          <span v-if="true" class="del-btn" @click.stop="del">删除</span>
        </div>

        <div class="operation">
          <!-- 点赞按钮 -->
          <div class="praise" v-if="true" @click.stop="praise">
            <img v-if="true" class="icon-zan" src="./../../assets/icon/bnt_zan_pre@3x.png" />
            <img v-else class="icon-zan" src="./../../assets/icon/bnt_zan@3x.png" />
            12
          </div>
          <!-- 评论按钮 -->
          <div class="comment" v-if="true" @click.stop="comment">
            <img class="icon-pinglun" src="./../../assets/icon/bnt_comment@3x.png" />
            30
          </div>
        </div>
      </div>
      <!-- 评论区 -->
      <div class="comment-area" v-if="true" @click="commentAreaClick">
        <!-- 点赞信息 -->
        <div class="praise-block" v-if="true">
          <img class="icon-zan" src="./../../assets/icon/bnt_zan@3x.png" />
          <div class="praise-name">
            <span class="favor-name" v-for="(favor, favorIndex) in favorList" :key="favorIndex" @click.stop="toUserInfo(favor.userId)">{{favorIndex > 0 ?  ','+favor.realName : favor.realName}}</span>
          </div>
          <span class="praise-total" v-if="true">等{{favorList.length}}人觉得很赞</span>
        </div>
        <!-- 评论信息 -->
        <div class="reply-block" v-if="true">
          <div class="reply" v-for="(reply,index) in comments" :key="index" v-if="true">
            <template v-if="false">
              <p>
                <span class="favor-name" @click.stop="toUserInfo(reply.reviewer.userId)">{{reply.reviewer.realName}}</span> 回复 <span class="favor-name" @click.stop="toUserInfo(reply.receiver.userId)">我是被回复的人</span>：{{reply.content}}
              </p>
            </template>
            <template v-else>
              <div>
                <p v-if="true"><span class="favor-name" @click.stop="toUserInfo(reply.reviewer.userId)">我是谁</span>: {{reply.content}}</p>
                <p v-else><span class="favor-name" @click.stop="toUserInfo(reply.reviewer.userId)">{{reply.reviewer.realName}}</span>: {{reply.content}}</p>
              </div>
            </template>
          </div>
          <div class="reply" v-if="false">
            <span class="favor-name">查看全部{{item.commentTotal}}条回复</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'discussItem',
  props: {
    isShowBorder: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      favorList: [
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
      ]
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
    toUserInfo () {
      console.log(' 我是去个人详情页的事件 ')
    },
    comment () {
      console.log(' 我是点击评论按钮评论事件 ')
    }
  }
}
</script>

<style lang="less" scoped>
.discussItem{
  display: flex;
  flex-wrap: wrap;
  padding:  30px 0;
  .left{
    height: 100%;
    .user-image{
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border:1px solid #EDEDED;
    }
  }
  /*右边模块*/
  .right {
    box-sizing: border-box;
    padding-bottom: 30px;
    padding-left: 30px;
    flex-grow: 1;
    font-size: 30px;/*px*/
    width: 560px;
    .content-head{
      color: #4080AD;
      font-size: 28px;/*px*/
      padding-bottom: 10px;
      .user-career{
        font-size: 24px;/*px*/
      }
    }
    &.border {
      border-bottom: solid 1px #ededed; /* no */
    }

    .info-area {
      display: flex;
      margin-top: 25px;
      justify-content: space-between;
      font-size: 24px;/*px*/
      font-weight: 400;
      align-items: center;
      color: #929292;
      .operation {
        display: flex;
        flex: 0 0 auto;
        .praise , .comment{
          font-size: 24px;
          font-weight: 300;
          color: #929292;
          line-height: 1;
          display: flex;
          align-items: center;
          padding: 0 4px;
          margin-right: 29px;
          img{
            width: 34px;
            height: 34px;
            margin-right: 8px;
          }
        }
        .comment{
          margin-right: 0;
        }
      }
      .del-btn {
        color: #4080AD;
        margin-left: 10px;
      }
    }

    /* 评论区 */
    & .comment-area {
      margin-top: 13px;
      padding: 5px 10px;
      width: 100%;
      border-radius: 3px;
      background-color: #f8f8f8;
      box-sizing: border-box;
      font-size: 13px;

      & .praise-block {
        padding: 18px 0 15px;
        display: flex;
        box-sizing: border-box;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        .icon-zan{
          width: 30px;
          height: 31px;
          margin-right: 12px;
        }
        .praise-total {
          font-size: 28px;/*px*/
          font-weight: 300;
          flex: 0 0 auto;
        }

        & .praise-name {
          font-size: 28px;/*px*/
          font-weight: 500;
          flex-grow: 1;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
      }

      .reply-block {
        font-size: 28px;/*px*/
        padding: 5px 0;
        .reply {
          margin-top: 4px;
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