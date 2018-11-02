<template>
  <!--打卡发表编辑页-->
  <div class="p-body p-publish-content">
    <div class="form-group">
      <textarea name="content" class="control" maxlength="1000" placeholder="说说你的想法..." v-model="form.content" />
      <p class="addon" :class="{ 'z-active': form.content.length > 0 }"><span class="current">{{form.content.length}}</span>/{{lengths.textMax}}</p>
    </div>
    <!--四项选择框-->
    <div class="select-box" v-show="isChoose" v-if="isChoose">
      <!--选择图片-->
      <div class="takePhoto">
        <upload-img class="wxChooseImg" :attach_type="'img'" @choseResult="choseResult" @upLoadResult="upLoadResult">
          <img slot="img" class="icon" src="@/assets/icon/btn_pic@3x.png" />
        </upload-img>
      </div>
      <!--选择视频-->
      <div class="audio" @click.stop="video">
        <input v-if="!isiOS" id="video" type="file" accept="video/*" capture="camcorder" multiple>
        <input v-else id="video" type="file" accept="*" multiple>
        <img class="icon" src="@/assets/icon/btn_video@3x.png"/>
      </div>
      <!--选择文件-->
      <div class="file" @click.stop="file">
        <input id="file" type="file" multiple>
        <img class="icon" src="@/assets/icon/btn_doc@3x.png"/>
      </div>
      <!--选择链接-->
      <div class="link" @click.stop="postLink">
        <img class="icon" src="@/assets/icon/btn_link@3x.png"/>
      </div>
    </div>
    <!--四项选择框-->
    <!--选择图片-->
    <div class="images" v-if="fileType === 0">
      <div class="item" v-for="(item, index) in images" :key="index">
        <img class="image" :src="item" />
        <div class="close" @click="handleDeleteImage(index, item)"><i class="icon iconfont icon-live_btn_close"></i></div>
      </div>
      <upload-img class="wxChooseImg"
        :attach_type="'img'"
        @choseResult="choseResult"
        @upLoadResult="upLoadResult"
        :count="count"
        v-if="images.length < 20">
        <img slot="img" class="icon" src="@/assets/icon/icon_plus.png" />
      </upload-img>
      <!--<div class="takePhoto" @click.stop="photo" v-if="images.length < 20">
        <input v-if="!isiOS" id="photo" type="file" accept="image/*" capture="camera" multiple>
        <input v-else id="photo" type="file" multiple>
        <img class="icon" src="@/assets/icon/icon_plus.png" />
      </div>-->
    </div>
    <!--视频-->
    <div class="video" v-if="fileType === 1">
      <div class="delBtn" @click="del"><i class="icon iconfont icon-live_btn_close"></i></div>
      <video width="416" height="234" controls v-if="movie">
        <source :src="movie" type="video/mp4">
        您的浏览器不支持 HTML5 video 标签。
      </video>
    </div>
    <!--文件-->
    <div class="file" v-if="fileType === 2">
      <div class="delBtn" @click="del"><i class="icon iconfont icon-live_btn_close"></i></div>
      <div class="content-file" @click.stop="fileOpen(fileData.url)">
        <img class="file-logo" :src="fileData.extension | fileCover" />
        <div class="file-desc">
          <p class="text">{{fileData.fileName}}</p>
          <p class="text">{{fileData.sizeM}}</p>
        </div>
      </div>
    </div>
    <!--链接-->
    <div class="postLink" v-if="fileType === 3">
      <div class="delBtn" @click="del"><i class="icon iconfont icon-live_btn_close"></i></div>
      <div class="content-file" @click.stop="tolink">
        <img v-show="true" class="file-logo" src="@/assets/icon/postLink.png" />
        <div class="file-desc">
          <p class="text">{{inpLink}}</p>
        </div>
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
    <div class="Mask" v-if="showMask" @click.stop="closeTask">
      <div class="inpLeft"><img src="@/assets/icon/btn_link@3x.png" /></div>
      <input @click.stop="inp" type="text" v-focus v-model="inpLink" placeholder="请在此处复制或者输入链接"/>
      <div class="linkBtn" @click.stop="done">确认</div>
    </div>
  </div>
</template>

<script>
import { attachesApi } from '@/api/pages/course'
import { jobcirclePostApi } from '@/api/pages/workCircle'
import uploadImg from '@c/functional/upLoadFile'
import store from '@/store/index.js'
export default {
  name: 'circleEdit',
  components: {
    uploadImg
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
      attachType: 'img', // 上传的文件类型默认图片
      fileName: 'img1', // 上传文件名，默认img1
      fileData: '', // 存在上传的文件数据
      uploadImgList: [], // 存放上传图片id的数组
      inpLink: '', // 输入的链接
      showMask: false, // 展示链接输入框
      isCircleSelf: false, // 是否仅限圈内可见
      isiOS: '',
      nowWeiXinImgNum: '' // 微信上传图片选中多少张
    }
  },
  methods: {
    /* 微信选择图片返回 */
    choseResult (res) {},
    /* 上传后返回 */
    upLoadResult (res) {
      res.forEach(item => {
        this.images.push(item.url)
        this.uploadImgList.push(item.id)
      })
      this.isChoose = false
      this.fileType = 0
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
        visible: this.isCircleSelf ? 1 : 0
      }
      if (this.fileType === 0) {
        param.pictures = this.uploadImgList
      } else if (this.fileType === 1) {
        param.videos = this.fileData.id
      } else if (this.fileType === 2) {
        param.files = this.fileData.id
      } else if (this.fileType === 3) {
        param.urls = this.inpLink
      }
      await jobcirclePostApi(param)
      let that = this
      this.$toast({
        text: '发帖成功',
        type: 'success',
        callBack () {
          console.log(that.$router)
          that.$router.go(-1)
        }
      })
    },
    /* 选择图片 */
    photo () {
      let that = this
      document.getElementById('photo').addEventListener('change', function (e) {
        let reader = new FileReader()
        let imgFile = this.files
        reader.readAsDataURL(this.files[0])
        let inp2 = this.cloneNode(true)
        this.parentNode.replaceChild(inp2, this)
        reader.onload = function () {
          that.attachType = 'img'
          for (let i = 0; i < imgFile.length; i++) {
            console.log(that.uploadImgList.length)
            that.uploadFile(imgFile[i]).then(res => {
              that.isChoose = false
              that.fileType = 0
              that.images.push(res.data[0].url)
              that.uploadImgList.push(res.data[0].id)
            })
          }
        }
      })
    },
    /* 上传图片或其他文件 */
    async uploadFile (nowImg) {
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      let formData = new FormData()
      formData.append('attach_type', this.attachType)
      formData.append(this.fileName, nowImg)
      return attachesApi(formData, config, true)
    },
    /**
     * 删除图片
     */
    handleDeleteImage (index, image) {
      this.images.splice(index, 1)
      this.uploadImgList.splice(index, 1)
      if (this.images.length === 0) {
        this.isChoose = true
        this.fileType = ''
      }
    },
    /* 上传视频 */
    video () {
      let that = this
      document.getElementById('video').addEventListener('change', function (e) {
        let reader = new FileReader()
        let videoFile = this.files[0]
        console.log(videoFile)
        reader.readAsDataURL(this.files[0])
        reader.onload = function () {
          that.attachType = 'video'
          // 上传视频文件
          that.uploadFile(videoFile).then(res => {
            that.isChoose = false
            that.fileType = 1
            that.fileData = res.data[0]
            that.movie = res.data[0].url
          })
        }
      })
    },
    /* 上传文件 */
    file () {
      let that = this
      document.getElementById('file').addEventListener('change', function (e) {
        let reader = new FileReader()
        let docFile = this.files[0]
        console.log(docFile.name)
        reader.readAsDataURL(this.files[0])
        reader.onload = function () {
          that.attachType = 'doc'
          that.fileName = docFile.name
          // 上传视频文件
          that.uploadFile(docFile).then(res => {
            that.isChoose = false
            that.fileType = 2
            that.fileData = res.data[0]
          })
        }
      })
    },
    del () {
      console.log(' 删除 ')
      this.fileData = ''
      this.movie = ''
      this.isChoose = true
      this.fileType = ''
      this.inpLink = ''
    },
    showimg () {
      let that = this
      document.getElementById('image').addEventListener('change', function (e) {
        let inp = this
        console.log(this.files)
        let reader = null
        reader = new FileReader()
        reader.readAsDataURL(this.files[0])
        reader.onload = function () {
          let b = that.dataURLtoFile(this.result)
          that.images.push(this.result)
        }
      })
    },
    // 将base64转换为文件
    dataURLtoFile (dataurl, filename) {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, {type: mime})
    },
    inp () {},
    /* 确认输入链接 */
    done () {
      if (this.inpLink) {
        console.log(this.inpLink)
        this.fileType = 3
        this.isChoose = false
        this.showMask = false
      }
    },
    postLink () {
      this.showMask = true
    },
    closeTask () {
      this.showMask = false
    },
    setCircleSelf () {
      this.isCircleSelf = !this.isCircleSelf
    },
    fileOpen (url) {
      window.location.href = url
    },
    /* 跳转链接 */
    tolink () {
      // window.location.href = this.inpLink
    }
  },
  created () {
    let u = navigator.userAgent
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
    this.isiOS = isiOS
  }
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
    padding: 25px;
    /* 四项选择盒子样子 */
    .select-box{
      display: flex;
      .takePhoto, .audio, .file, .link{
        position: relative;
        margin-right: 9px;
        width: 77px;
        height: 77px;
        background: #FBFBFB;
        display: flex;
        align-items: center;
        justify-content: center;
        >input{
          color: #FFFFFF;
          width: 77px;
          height: 77px;
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          z-index: 5;
        }
        .icon{
          width: 23px;
          height: 23px;
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
        width: 102px;
        height: 102px;
      }
      .item {
        position: relative;
        display: block;
        flex: 0 0 auto;
        box-sizing: border-box;
        margin: 0 3px 6px;
        font-size: 0;
        &>.image {
          background: #f1f1f1;
          width: 102px;
          height: 102px;
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
          width: 102px;
          height: 102px;
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
        margin-left: 3px;
        box-sizing: border-box;
        position: relative;
        border: 1px solid #EDEDED;
        width: 102px;
        height: 102px;
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
      >.delBtn{
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
      >video{
        object-fit:fill;
        width: 208px;
        /*height: 117px;*/
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
      /*  文件  */
      .content-file {
        margin-top: 15px;
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
            font-weight: 300;
            display: block;
            max-width: 261px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          .text:last-of-type {
            font-weight: 300;
            margin-top: 1px;
            color: #bcbcbc;
          }
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
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
      z-index: 8888;
      .inpLeft{
        position: absolute;
        padding-right: 8px;
        bottom: 32px;
        left: 32px;
        width: 20px;
        height: 20px;
        z-index: 100;
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
        position: absolute;
        left: 20px;
        bottom: 20px;
        color: #354048;
        box-sizing: border-box;
        padding-left: 45px;
        padding-right: 20px;
        font-size: 30px;/*px*/
      }
      .linkBtn{
        position: absolute;
        bottom: 32px;
        right: 20px;
        font-size: 32px;/*px*/
        color: #FFE266;
      }
    }
  }
</style>