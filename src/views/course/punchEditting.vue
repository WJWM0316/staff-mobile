<template>
  <div class="p-publish-content">
    <div class="form-group">
      <textarea name="content" class="control" maxlength="1000" placeholder="说说你的想法..." v-model="form.content" />
      <p class="addon" :class="{ 'z-active': form.content.length > 0 }"><span class="current">{{form.content.length}}</span>/{{lengths.textMax}}</p>
    </div>
    <!--微信图片上传-->
    <div class="wx-images" v-if="false">
      <div class="item" v-for="(item, index) in images" :key="index">
        <image-item class="image" mode="auto" :src="item.base64Url || item.fileUrl" />
        <button type="button" class="close u-btn" @click="handleDeleteImage(index, item)"><i class="icon iconfont icon-live_btn_close"></i></button>
      </div>
      <a href="#" class="add item" v-if="images.length < lengths.imageMax" @click.prevent.stop="handleAdd"><i class="u-icon-plus"></i></a>
    </div>
    <!--选择图片-->
    <div class="chooseImg">
      <div class="item" v-for="(item, index) in images" :key="index">
        <img class="image" mode="auto" :src="item" />
        <button type="button" class="close" @click="handleDeleteImage(index, item)"><i class="icon iconfont icon-live_btn_close"></i></button>
      </div>
      <div class="takePhoto" @click.stop="photo">
        <input id="photo" type="file" accept="image/*" capture="camera" multiple>
        <img class="icon" src="@/assets/icon/icon_plus.png" />
      </div>
    </div>
    <!--发表按钮-->
    <div class="btn-container">
      <button type="button" class="u-btn-publish" :disabled="!canPublish" @click="handleSubmit">发表</button>
    </div>
    <!--打卡任务-->
    <div class="showTask" @click.stop="showTask" v-if="taskContent.punchCardTitle && taskContent.punchCardCImgInfo">本节打卡任务 <img src="@/assets/icon/btn_up_task@3x.png"/></div>
    <div class="taskWindow" v-if="showTaskWindow">
      <div class="taskhead" @click.stop="closeTask">本节打卡任务 <img src="@/assets/icon/btn_packup_task@3x.png"/></div>
      <div class="taskbody">
        <div v-html="taskContent.punchCardTitle"></div>
        <!--图片-->
        <div class="content-img" v-if="taskContent.punchCardCImgInfo && taskContent.punchCardCImgInfo.length>0">
          <div class="content-images">
            <!-- 图片为 1 张时 -->
            <div class="item-image one" v-if="taskContent.punchCardCImgInfo && taskContent.punchCardCImgInfo.length === 1">
              <img :src="taskContent.courseCardFile[0].fileUrl || '@/assets/icon/img_head_default.png'" @click.stop="previewImage(taskContent.courseCardFile[0].fileUrl)" />
            </div>
            <!--  图片为 多 张时  -->
            <div class="item-image" v-for="(file,index) in taskContent.punchCardCImgInfo" :key="index" v-else>
              <img :src="file.fileUrl || '@/assets/icon/img_head_default.png'" v-if="!file.holder" @click.stop="previewImage(file.fileUrl)" />
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
export default {
  name: 'punchEditting',
  data () {
    return {
      form: {
        courseId: '', // 课节id
        content: '' // 文本内容
      },
      // 文本长度
      lengths: {
        textMax: 1000, // 文本最大字数
        imageMax: 9 // 图片最大张数
      },
      images: [], // 选择图片
      uploadImgList: [], // 即将发布的图片
      showTaskWindow: false,
      taskContent: {} // 打卡编辑页详情
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
    /* 选择图片 */
    photo () {
      console.log(' 拍照 ')
      let that = this
      document.getElementById('photo').addEventListener('change', function (e) {
        let reader = new FileReader()
        let imgFile = this.files[0]
        reader.readAsDataURL(this.files[0])
        /* 刷新节点 */
        let inp2 = this.cloneNode(true)
        this.parentNode.replaceChild(inp2, this)
        /* 刷新节点 */
        reader.onload = function () {
          that.uploadImg(imgFile).then(res => {
            that.images.push(res.data[0].url)
            that.uploadImgList.push(res.data[0].id)
            console.log(that.uploadImgList, ' 222222222222222222222 ')
          })
        }
      })
    },
    /* 上传图片 */
    async uploadImg (nowImg) {
      console.log(nowImg, ' 33333333333333 ')
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
    /* 预备发布 */
    async readyPublish () {
      this.images.map(function (item, index) {
        let reader = new FileReader()
        reader.readAsBinaryString(item)
        reader.onload = function () {
          console.log(this.result)
        }
      })
      console.log(this.images)
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
        console.log(param, ' 我是传递出去的打卡参数 ')
        await postPunchCardApi(param)
        this.$router.go(-1)
      } catch (e) {
        this.$toast(e)
      }
    },
    /* 删除图片 */
    handleDeleteImage (index, image) {
      this.images.splice(index, 1)
      this.uploadImgList.splice(index, 1)
      console.log(this.images, this.uploadImgList)
    }
  },
  created () {
    let { courseSectionId } = this.$route.query
    getPunchCardDetailsApi({name: 'courseSectionId', id: courseSectionId}).then(res => {
      this.taskContent = res.data
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
    .chooseImg{
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
        border: 1px dashed #EDEDED;
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
      margin: 40px 0px;
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
      background-color: #000;
      opacity: 0.5;
      z-index: 8888;
    }
  }
</style>