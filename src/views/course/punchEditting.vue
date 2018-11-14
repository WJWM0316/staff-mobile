<template>
  <div class="p-publish-content">
    <div class="form-group">
      <textarea name="content" class="control" maxlength="1000" placeholder="请输入打卡内容..." v-model="form.content" />
      <p class="addon" :class="{ 'z-active': form.content.length > 0 }"><span class="current">{{form.content.length}}</span>/{{lengths.textMax}}</p>
    </div>
    <!--微信图片上传-->
    <div class="wx-images" v-if="false">
      <div class="item" v-for="(item, index) in images" :key="index">
        <img class="image" mode="auto" :src="item" />
        <button type="button" class="close" @click="handleDeleteImage(index, item)"><i class="icon iconfont icon-live_btn_close"></i></button>
      </div>
      <div class="takePhoto" @click.stop="wxPhoto" v-if="images.length < 9">
        <img class="icon" src="@/assets/icon/icon_plus.png" />
      </div>
      <!--<a href="#" class="add item" v-if="images.length < lengths.imageMax" @click.prevent.stop="handleAdd"><i class="u-icon-plus"></i></a>-->
    </div>
    <!--选择图片-->
    <div class="chooseImg">
      <div class="item" v-for="(item, index) in images" :key="index">
        <img class="image" mode="auto" :src="item" />
        <button type="button" class="close" @click="handleDeleteImage(index, item)"><i class="icon iconfont icon-live_btn_close"></i></button>
      </div>
      <upload-img class="wxChooseImg" :attach_type="'img'" @choseResult="choseResult" @upLoadResult="upLoadResult" :count="9-uploadImgList.length" v-if="images.length<9">
        <img slot="img" class="icon" src="@/assets/icon/icon_plus.png" />
      </upload-img>
      <!--<div class="takePhoto" @click.stop="photo" v-if="images.length < 9">
        <input v-if="!isiOS" id="photo" type="file" accept="image/*" capture="camera" multiple>
        <input v-else id="photo" type="file" multiple="9">
        <img class="icon" src="@/assets/icon/icon_plus.png" />
      </div>-->
    </div>
    <!--发表按钮-->
    <div class="btn-container">
      <button type="button" class="u-btn-publish" :disabled="!canPublish" @click="handleSubmit">发表</button>
    </div>
    <!--打卡任务-->
    <div class="showTask" @click.stop="showTask" v-if="taskContent.punchCardTitle || (taskContent.punchCardCImgInfo && taskContent.punchCardCImgInfo.length > 0)">本节打卡任务 <img src="@/assets/icon/btn_up_task@3x.png"/></div>
    <div class="taskWindow" v-if="showTaskWindow">
      <div class="taskhead" @click.stop="closeTask">本节打卡任务 <img src="@/assets/icon/btn_packup_task@3x.png"/></div>
      <div class="taskbody">
        <div v-html="taskContent.punchCardTitle"></div>
        <!--图片-->
        <div class="content-img" v-if="taskContent.punchCardCImgInfo && taskContent.punchCardCImgInfo.length>0">
          <div class="content-images">
            <!-- 图片为 1 张时 -->
            <div class="item-image one" v-if="taskContent.punchCardCImgInfo && taskContent.punchCardCImgInfo.length === 1">
              <img :src="taskContent.punchCardCImgInfo[0].smallUrl || '@/assets/icon/img_head_default.png'" v-preview="true" :data-src="taskContent.punchCardCImgInfo[0].url" />
            </div>
            <!--  图片为 多 张时  -->
            <div class="item-image" v-for="(file,index) in taskContent.punchCardCImgInfo" :key="index" v-else>
              <img :src="file.smallUrl || '@/assets/icon/img_head_default.png'" v-if="!file.holder" v-preview="true" :data-src="file.url"/>
            </div>
          </div>
        </div>
      <!--图片-->
      </div>
    </div>
    <!--遮罩层-->
    <div class="Mask" v-if="showTaskWindow" @click.stop="closeTask"></div>
  </div>
</template>

<script>
import { postPunchCardApi, getPunchCardDetailsApi, attachesApi } from '@/api/pages/course'
import uploadImg from '@c/functional/upLoadFile'
import localstorage from '@u/localstorage'
export default {
  components: {
    uploadImg
  },
  data () {
    return {
      form: {
        courseId: '', // 课节id
        content: '' // 文本内容
      },
      lengths: {
        textMax: 1000, // 文本最大字数
        imageMax: 9 // 图片最大张数
      },
      images: [], // 选择图片
      uploadImgList: [], // 即将发布的图片
      showTaskWindow: false,
      taskContent: {}, // 打卡编辑页详情
      isSend: false, // 是否已经发送编辑
      isiOS: '', // 是否ios
      lastPunchImg: [] // 历史打卡图片
    }
  },
  computed: {
    canPublish: {
      get: function () {
        return this.form.content.length > 0
      }
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
          for (let i = 0; i < imgFile.length; i++) {
            if (that.uploadImgList.length >= 9) return
            that.uploadImg(imgFile[i]).then(res => {
              that.images.push(res.data[0].url)
              that.uploadImgList.push(res.data[0].id)
            })
          }
        }
      })
    },
    /* 上传图片 */
    async uploadImg (nowImg) {
      let param = {
        attach_type: 'img',
        img: nowImg
      }
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      let formData = new FormData()
      formData.append('attach_type', 'img')
      formData.append('img1', nowImg)
      return attachesApi(formData, config)
    },
    /* 转化file对象,需要是调用 */
    dataURLtoFile (dataurl, filename) { // 将base64转换为文件
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
    /* 提交表单 */
    handleSubmit (e) {
      const self = this
      this.$vux.confirm.show({
        content: '确定要发布？',
        onConfirm () {
          self.Publish()
        }
      })
    },
    showTask () {
      this.showTaskWindow = true
    },
    closeTask () {
      this.showTaskWindow = false
    },
    /* 发布 */
    async Publish () {
      try {
        let param = {
          course_section_id: this.taskContent.courseSectionId,
          card_content: this.form.content,
          type: this.uploadImgList.length > 0 ? 3 : 0,
          array_file_id: this.uploadImgList
        }
        await postPunchCardApi(param)
        let that = this
        this.$toast({
          text: '打卡成功',
          type: 'success',
          callBack () {
            that.isSend = true
            localstorage.remove('draft')
            localstorage.remove('draftImg')
            localstorage.remove('draftImgId')
            this.$router.push({path: "/courseLesson",query: {id: this.$route.query.id}})
          }
        })
      } catch (e) {
        this.$toast({text: e.msg})
      }
    },
    /* 删除图片 */
    handleDeleteImage (index, image) {
      this.images.splice(index, 1)
      this.uploadImgList.splice(index, 1)
      console.log(this.images, this.uploadImgList)
    },
    /* 是否加载草稿 */
    loadDraft () {
      let that = this
      let content = localstorage.get('draft')
      let imgList = localstorage.get('draftImg')
      let imgUploadList = localstorage.get('draftImgId')
      if (content || imgList) {
        this.$confirm({
          title: ' 加载草稿 ',
          content: ' 检测到有草稿，是否加载？ ',
          confirmBack () {
            that.form.content = content
            that.images = imgList || []
            that.uploadImgList = imgUploadList || []
          },
          cancelBack () {
          }
        })
      }
    }
  },
  created () {
    let u = navigator.userAgent
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
    this.isiOS = isiOS
    let { id } = this.$route.query
    getPunchCardDetailsApi({name: 'courseSectionId', id: id}).then(res => {
      this.taskContent = res.data
      if (res.data.peopleCourseCardInfo) {
        // 是否已经打过卡
        this.form.content = res.data.peopleCourseCardInfo.cardContent
        res.data.peopleCourseCardInfo.cardContentFile.forEach((item, index) => {
          this.images.push(item.url)
          this.lastPunchImg.push(item.url)
          this.uploadImgList.push(item.id)
        })
      }
      // 是否加载草稿
      this.loadDraft()
    })
  },
  beforeRouteLeave (to, from, next) {
    if (this.isSend) {
      next()
      return
    }
    if (JSON.stringify(this.images) === JSON.stringify(this.lastPunchImg) && this.form.content === (this.taskContent.peopleCourseCardInfo ? this.taskContent.peopleCourseCardInfo.cardContent : '')) {
      next()
      return
    }
    let that = this
    this.$confirm({
      title: '退出编辑',
      content: '退出编辑，是否将内容存为草稿？',
      confirmBack () {
        localstorage.set('draft', that.form.content)
        localstorage.set('draftImg', that.images)
        localstorage.set('draftImgId', that.uploadImgList)
        next()
      },
      cancelBack () {
        next()
      }
    })
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
  .p-publish-content{
    position: relative;
    padding: 18px;
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
    .wxChooseImg{
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
    .chooseImg, .wx-images{
      display: flex;
      flex-wrap: wrap;
      .item {
        position: relative;
        display: block;
        flex: 0 0 auto;
        box-sizing: border-box;
        margin: 0 5px 3px 0;
        font-size: 0;
        &:nth-of-type(3n){
          margin-right: 0;
        }
        &>.image {
          background: #f1f1f1;
          width: 108px;
          height: 108px;
          line-height: 100px;
          object-fit: cover;
          vertical-align: middle;
        }
        .close {
          position: absolute;
          right: 0;
          top: 0;
          border: none;
          background-color: rgba(0,0,0,0.2);
          width: 26px;
          height: 26px;
          z-index: 6;
          >i{
           font-size: 30px;/*px*/
           color: #FFFFFF;
          }
        }
      }
      .takePhoto{
        position: relative;
        width: 108px;
        height: 108px;
        background: #FFFFFF;
        border: 1px solid #EDEDED;
        display: flex;
        align-items: center;
        justify-content: center;
        >input{
          color: #FFFFFF;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0;
          z-index: 5;
        }
        .icon{
          width: 25px;
          height: 25px;
        }
      }
    }
    .btn-container {
      margin: 25px 0px 30px;
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
        font-weight: 300;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
          margin-left: 2px;
          width: 18px;
          height: 18px;
        }
      }
      .taskbody{
        background-color: #FFFFFF;
        color: #354048;
        font-weight: 300;
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
              object-fit: cover;
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
      background-color: #000;
      opacity: 0.5;
      z-index: 8888;
    }
  }
</style>