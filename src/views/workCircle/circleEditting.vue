<template>
  <!--打卡发表编辑页-->
  <div class="p-body p-publish-content">
    <div class="form-group">
      <textarea name="content" class="control" maxlength="1000" placeholder="说说你的想法..." v-model="form.content" />
      <p class="addon" :class="{ 'z-active': form.content.length > 0 }"><span class="current">{{form.content.length}}</span>/{{lengths.textMax}}</p>
    </div>
    <!--四项选择框-->
    <div class="select-box" v-show="isChoose">
      <!--选择图片-->
      <div class="takePhoto" @click="attachType = 'img'">
        <uploadFile
          class="wxChooseImg"
          attach_type='img'
          @choseResult="choseResult"
          @upLoadResult="upLoadResult"
        >
          <img slot="img" class="icon" src="@/assets/icon/btn_pic@3x.png" />
        </uploadFile>
      </div>
      <!--选择视频-->
      <div class="video" @click="attachType = 'video'">
        <uploadFile class="wxChooseImg"
          attach_type='video'
          @choseResult="choseResult"
          @upLoadResult="upLoadResult"
        >
        </uploadFile>
        <img class="icon" src="@/assets/icon/btn_video@3x.png"/>
      </div>
      <!--选择文件-->
      <div class="file" @click="attachType = 'doc'">
        <uploadFile class="wxChooseImg"
          attach_type='doc'
          @choseResult="choseResult"
          @upLoadResult="upLoadResult"
        >
        </uploadFile>
        <img class="icon" src="@/assets/icon/btn_doc@3x.png"/>
      </div>
      <!--选择链接-->
      <div class="link" @click.stop="postLink">
        <img class="icon" src="@/assets/icon/btn_link@3x.png"/>
      </div>
    </div>
    <!--四项选择框-->
    <!--选择图片-->
    <div class="images" v-show="fileType === 0">
      <div class="item" v-for="(item, index) in images" :key="index">
        <img class="image" :src="item" />
        <div class="close" @click="delFile('img', index, item)"><i class="icon iconfont icon-live_btn_close"></i></div>
      </div>
      <uploadFile class="wxChooseImg"
        :attach_type="'img'"
        @choseResult="choseResult"
        @upLoadResult="upLoadResult"
        :count="count"
        v-if="images.length < 20">
        <img slot="img" class="icon" src="@/assets/icon/icon_plus.png" />
      </uploadFile>
    </div>
    <!--视频-->
    <div class="video" v-show="fileType === 1">
      <div class="delBtn" @click="delFile('video')"><i class="icon iconfont icon-live_btn_close"></i></div>
        <videoBox class="videoBox" :url="movie"></videoBox>
    </div>
    <!--文件-->
    <div class="file" v-show="fileType === 2">
      <div class="delBtn" @click="delFile('doc')"><i class="icon iconfont icon-live_btn_close"></i></div>
      <div class="content-file">
        <fileBox :item="fileData"></fileBox>
      </div>
    </div>
    <!--链接-->
    <div class="postLink" v-show="fileType === 3">
      <div class="delBtn" @click="delFile('link')"><i class="icon iconfont icon-live_btn_close"></i></div>
      <div class="content-file">
        <fileBox :item="inpLink" :isFile='false'></fileBox>
      </div>
    </div>
    <div class="circleSelf" @click.stop="setCircleSelf">
      <i class="icon iconfont icon-unselect" v-if="isCircleSelf"></i>
      <i class="icon iconfont icon-select isCircleSelf" v-else></i>
      仅工作圈成员可见
    </div>
    <div class="btn-container">
      <button type="button" class="u-btn-publish" :disabled="!canPublish" @click="handleSubmit">发布</button>
    </div>
    <!--链接输入弹窗-->
    <div class="Mask" v-show="showMask" @click.stop="closeTask">
      <div class="bottomBox" ref="content">
        <div class="inpLeft"><img src="@/assets/icon/btn_link@3x.png"/></div>
        <input type="text" v-model="inpLink.title" placeholder="请在此处复制或者输入链接"/>
        <div class="linkBtn" @click.stop="done">确认</div>
      </div>
    </div>
  </div>
</template>
<script>
import { attachesApi } from '@/api/pages/course'
import { jobcirclePostApi } from '@/api/pages/workCircle'
import uploadFile from '@c/functional/upLoadFile'
import fileBox from '@c/functional/fileBox'
import browser from '@u/browser'
import {URL} from '@u/regular'
import localstorage from '@u/localstorage'
import videoBox from '@c/functional/video'
import { removeFileApi } from '@/api/common'
export default {
  name: 'circleEdit',
  components: {
    uploadFile,
    videoBox,
    fileBox
  },
  computed: {
    canPublish: {
      get: function () {
        return this.form.content.length > 0
      }
    },
    count: {
      get: function () {
        if (this.images.length < 18) {
          return 9
        } else {
          return 20 - this.images.length
        }
      }
    },
    isiOS () {
      return browser.isIos()
    },
    isWechat () {
      return browser.isWechat()
    }
  },
  data () {
    return {
      form: {
        courseId: '', // 课节id
        content: '' // 文本内容
      },
      isChoose: true,
      fileType: '', // 0:图片，1：视频，2：文件，3：链接
      images: [], // 上传的是图片
      // 文本长度
      lengths: {
        textMax: 1000, // 文本最大字数
        imageMax: 20 // 图片最大张数
      },
      movie: '', // 上传的视频
      attachType: null, // 上传的文件类型
      fileData: null, // 存在上传的文件数据
      uploadImgList: [], // 存放上传图片id的数组
      inpLink: {
        title: ''
      }, // 输入的链接
      showMask: false, // 展示链接输入框
      isCircleSelf: false, // 是否仅限圈内可见
      nowWeiXinImgNum: '', // 微信上传图片选中多少张
      isSend: false, // 是否已经发送帖子
      send: false
    }
  },
  methods: {
    /* 微信选择图片返回 */
    choseResult (res) {
      switch (this.attachType) {
        case 'img':
          if (this.isWechat) {
            this.images = this.images.concat(res)
          }
          break
      }
    },
    /* 上传后返回 */
    upLoadResult (res) {
      switch (this.attachType) {
        case 'img':
          res.forEach(item => {
            if (!this.isWechat) {
              this.images.push(item.url)
            }
            this.uploadImgList.push(item.id)
          })
          this.isChoose = false
          this.fileType = 0
          break
        case 'video':
          this.isChoose = false
          this.fileType = 1
          this.fileData = res[0]
          this.movie = res[0].url
          break
        case 'doc':
          this.isChoose = false
          this.fileType = 2
          this.fileData = res[0]
      }
    },
    /**
     * 提交表单
     */
    handleSubmit (e) {
      const self = this
      console.log(this.fileType)
      this.$vux.confirm.show({
        content: '确定要发布？',
        onConfirm () {
          self.readyPublish()
        }
      })
    },
    /* 发布 */
    async readyPublish () {
      let content = this.form.content.trim()
      if (content.length === 0) {
        this.$toast({text: ' 内容不能为空 '})
        return
      }
      let param = {
        community_id: this.$route.query.id,
        content: this.form.content,
        visible: this.isCircleSelf ? 0 : 1
      }
      if (this.fileType === 0) {
        param.pictures = this.uploadImgList
      } else if (this.fileType === 1) {
        param.videos = this.fileData.id
      } else if (this.fileType === 2) {
        param.files = this.fileData.id
      } else if (this.fileType === 3) {
        param.urls = this.inpLink.title
      }
      await jobcirclePostApi(param)
      let that = this
      this.$toast({
        text: '发帖成功',
        type: 'success',
        callBack () {
          that.isSend = true
          that.$router.go(-1)
        }
      })
    },
    /**
     * 删除文件
     */
    delFile (type, index, image) {
      if (type === 'img') {
        this.images.splice(index, 1)
        removeFileApi({id: this.uploadImgList[index]}, false).then(res => {
          this.uploadImgList.splice(index, 1)
        })
        if (this.images.length === 0) {
          this.isChoose = true
          this.fileType = null
        }
      } else if (type === 'video') {
        removeFileApi({id: this.fileData.id}, false).then(res => {
          this.fileData = null
          this.movie = ''
        })
      } else if (type === 'link') {
        this.inpLink.title = ''
      } else {
        removeFileApi({id: this.fileData.id}, false).then(res => {
          this.fileData = null
        })
      }
      this.fileType = ''
      this.isChoose = true
    },
    /* 确认输入链接 */
    done () {
      if (this.inpLink.title === '') {
        this.$toast({text: '链接不能为空'})
      } else if (!URL.test(this.inpLink.title)) {
        this.$toast({text: '链接格式不正确'})
      } else {
        this.fileType = 3
        this.isChoose = false
        this.showMask = false
      }
    },
    postLink () {
      this.showMask = true
    },
    closeTask (e) {
      // 点击区域是底部输入框的不需要关闭
      if (e.target.parentNode === this.$refs.content) return
      this.showMask = false
    },
    setCircleSelf () {
      this.isCircleSelf = !this.isCircleSelf
    }
  },
  created () {
  }
  // ,
  // beforeRouteLeave (to, from, next) {
  //   let that = this
  //   if (this.isSend) {
  //     next(true)
  //   } else {
  //     this.$confirm({
  //       title: '退出编辑',
  //       content: '是否要退出编辑？',
  //       confirmBack () {
  //         next(true)
  //       },
  //       cancelBack () {
  //         next(false)
  //       }
  //     })
  //   }
  // }
}
</script>

<style lang="less" scoped>
  @keyframes task-fade-in {
    from {
      opacity: 0;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .p-publish-content {
    /*padding-bottom: 20px;*/
    position: relative;
    padding: 25px 20px;
    /* 四项选择盒子样子 */
    .select-box{
      display: flex;
      .takePhoto, .video, .file, .link{
        position: relative;
        margin-right: 9px;
        width: 77px;
        height: 77px;
        background: #FBFBFB;
        .icon{
          width: 23px;
          height: 23px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .link{
        margin-right: 0;
      }
      .wxChooseImg{
        width: 100%;
        height: 100%;
        .icon{
          width: 25px;
          height: 25px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
        }
      }
    }
    .form-group {
      position: relative;
      margin-bottom: 7px;
      padding-bottom: 20px;
      .control {
        width: 100%;
        line-height: 20px;
        font-size: 15px;
        height: 120px;
        border: none;
        resize: none;
      }
      .addon {
        display: block;
        position: absolute;
        right: 0;
        bottom: 0;
        line-height: 20px;
        font-size: 13px;
        color: #bcbcbc;
        &.z-active .current {
          color: #d7ab70;
        }
      }
    }
    /* 图片展示区样式 */
    .images {
      display: flex;
      margin: 0 -3px -6px;
      flex-flow: row wrap;
      >input{
        width: 108px;
        height: 108px;
      }
      .item {
        position: relative;
        display: block;
        flex: 0 0 auto;
        box-sizing: border-box;
        margin-bottom: 5px;
        margin-right: 5px;
        font-size: 0;
        &:nth-of-type(3n){
          margin-right: 0;
        }
        &>.image {
          background: #f1f1f1;
          width: 108px;
          height: 108px;
          object-fit: cover;
          vertical-align: middle;
        }
        .close {
          position: absolute;
          right: 0px;
          top: 0px;
          width: 26px;
          height: 26px;
          background: rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          >i{
            font-size: 40px;/*px*/
           color: #FFFFFF;
          }
        }
        &.add {
          width: 108px;
          height: 108px;
          line-height: 100px;
          text-align: center;
          border: solid 1px #ededed;
          background-image: url(../../assets/icon/icon_plus.png);
          background-repeat: no-repeat;
          background-size: 50%;
          background-position: 50% 50%;
          /* no */
        }
      }
      .wxChooseImg{
        box-sizing: border-box;
        position: relative;
        border: 1px solid #EDEDED;
        width: 108px;
        height: 108px;
        .icon{
          width: 25px;
          height: 25px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
        }
      }
    }
    .video{
      display: inline-block;
      position: relative;
      .videoBox {
        width: 208px;
        height: 117px;
      }
      .delBtn{
        position: absolute;
        right: 3px;
        top: 3px;
        z-index: 7;
        >i{
          font-size: 40px;/*px*/
          color: #FFFFFF;
          height: 20px;
          width: 20px;
        }
      }
    }
    .file, .postLink{
      position: relative;
      >.delBtn{
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #CCCCCC;
        position: absolute;
        right: -7px;
        top: -7px;
        z-index: 7;
        line-height: 16px;
        text-align: center;
        >i{
          font-size: 20px;/*px*/
          color: #FFFFFF;
          height: 20px;
          width: 20px;
        }
      }
    }
    .postLink{
      .text{
        color: #111111 !important;
        font-size: 28px !important;/*px*/
      }
    }
    .circleSelf{
      margin-top: 20px;
      font-size: 26px;/*px*/
      color: #929292;
      >i{
        font-size: 30px;/*px*/
       margin-right: 4px;
      }
      .isCircleSelf{
        color: #FFE266;
      }
    }
    .btn-container {
      margin: 30px 0px;
      .u-btn-publish {
        border: none;
        padding: 10px;
        background: #ffe266;
        width: 100%;
        line-height: 24px;
        border-radius: 22px;
        font-size: 15px;
        color: #354048;
        &[disabled] {
          opacity: .5;
        }
        &::after {
          content: none;
        }
      }
    }
    /*打卡任务详情*/
    .showTask{
      display: flex;
      align-items: center;
      justify-content: center;
      color: #929292;
      font-size: 14px;
      img{
        padding-top: 2px;
        padding-left: 2px;
        width: 18px;
        height: 18px;
      }
    }
    /*打卡任务窗口*/
    .taskWindow{
      position: fixed;
      bottom:0;
      left: 0;
      box-sizing: border-box;
      width: 100%;
      height: 363px;
      z-index: 9999;
      animation: task-fade-in 300ms ease-in-out;
      .taskhead{
        width: 100%;
        height: 44px;
        background-color: #F8F8F8;
        border-radius: 20px 20px 0 0;
        color:#929292;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
          margin-left: 2px;
        }
      }
      .taskbody{
        background-color: #FFFFFF;
        padding: 20px;
        height: 319px;
        overflow-y: scroll;
      }
      /*打卡任务图片*/
      .content-img{
        & .content-images {
          margin-top: 10px;
          width: 335px;
          display: flex;
          flex-flow: row wrap;
          & > .item-image {
            margin-top: 5px;
            margin-left: 5px;
            width: 108px;
            height: 108px;
            text-align: center;
            flex-grow:0;
            &:first-of-type, &:nth-of-type(3n + 1) {
              margin-left: 0;
            }
            & img {
              background: #f9f9f9;
              width: 100%;
              height: 100%;
              vertical-align: middle;
            }
          }
          & > .item-image.one {
            width: 136px;
            height: 136px;
          }
        }
      }
    }
    .Mask{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background-color: rgba(0,0,0,0.5);
      -webkit-user-select: none;
      -webkit-user-drag: none;
      .bottomBox {
        position: absolute;
        width: 100%;
        height: 44px;
        bottom: 20px;
        overflow: hidden;
        padding: 0 20px;
        box-sizing: border-box;
        .inpLeft{
          width: 20px;
          height: 20px;
          position: absolute;
          top: 50%;
          margin-top: -10px;
          left: 32px;
          >img{
            left: 32px;
            width: 20px;
            display: block;
          }
        }
        >input{
          width: 290px;
          height: 44px;
          background: #FFFFFF;
          border-radius: 35px;
          color: #354048;
          box-sizing: border-box;
          padding-left: 45px;
          padding-right: 20px;
          font-size: 30px;/*px*/
        }
        .linkBtn{
          font-size: 32px;/*px*/
          color: #FFE266;
          float: right;
          line-height: 44px;
        }
      }
    }
  }
</style>