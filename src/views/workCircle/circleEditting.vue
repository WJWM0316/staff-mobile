<template>
  <!--打卡发表编辑页-->
  <div class="p-body p-publish-content">
    <div class="form-group">
      <textarea name="content" class="control" maxlength="1000" placeholder="说说你的想法..." v-model="form.content" />
      <p class="addon" :class="{ 'z-active': form.content.length > 0 }"><span class="current">{{form.content.length}}</span>/{{lengths.textMax}}</p>
    </div>
    <div class="select-box" v-show="isChoose">
      <div class="takePhoto" @click.stop="photo">
        <img class="icon" src="@/assets/icon/btn_pic@3x.png" alt="" />
      </div>
      <div class="audio" @click.stop="video">
        <img class="icon" src="@/assets/icon/btn_video@3x.png"/>
      </div>
      <div class="file" @click.stop="file">
        <img class="icon" src="@/assets/icon/btn_doc@3x.png"/>
      </div>
      <div class="link" @click.stop="link">
        <img class="icon" src="@/assets/icon/btn_link@3x.png"/>
      </div>
    </div>
    <!--图片-->
    <div class="images" v-if="fileType === 0">
      <div class="item" v-for="(item, index) in images" :key="index">
        <img class="image" :src="item" />
        <button type="button" class="close u-btn" @click="handleDeleteImage(index, item)"><i class="u-icon-delete-image"></i></button>
      </div>
      <input  @click.stop="showimg" type="file" accept="image/*" webkitdirectory>
      <!--<a href="#" class="add item" v-if="images.length < lengths.imageMax" @click.prevent.stop="handleAdd"><i class="u-icon-plus"></i></a>-->
    </div>
    <!--视频-->
    <div class="video" v-if="fileType === 1">
      <input @click.stop="showimg" type="file" id="image" accept="video/*" capture="camcorder" multiple>
      <video width="320" height="240" controls v-if="movie">
        <source :src="movie" type="video/mp4">
        <source :src="movie" type="video/ogg">
        您的浏览器不支持 HTML5 video 标签。
      </video>
    </div>
    <div class="btn-container">
      <button type="button" class="u-btn-publish" :disabled="false" @click="handleSubmit">发布</button>
    </div>
    <div class="Mask" v-if="false" @click.stop="closeTask"></div>
  </div>
</template>

<script>
export default {
  name: 'circleEdit',
  data () {
    return {
      form: {
        courseId: '', // 课节id
        content: '' // 文本内容
      },
      isChoose: true,
      fileType: '', // 0:图片，1：视频，2：文件，3：链接
      images: [],
      // 文本长度
      lengths: {
        textMax: 1000, // 文本最大字数
        imageMax: 20 // 图片最大张数
      },
      movie: ''
    }
  },
  methods: {
    /**
     * 提交表单
     */
    handleSubmit (e) {
      const self = this
      console.log(this.$refs['image'].files[0])
      this.$vux.confirm.show({
        content: '确定要发布？',
        onConfirm () {
          self.readyPublish()
        }
      })
    },
    /* 选择图片 */
    photo () {
      this.isChoose = false
      this.fileType = 0
      console.log(' 拍照 ')
    },
    video () {
      this.isChoose = false
      this.fileType = 1
    },
    showimg () {
      let that = this
      document.getElementById('image').addEventListener('change', function (e) {
        var reader = new FileReader()
        reader.onload = function () {
          let b = that.dataURLtoFile(this.result)
          that.movie = this.result
          console.log(this.result)
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
    }
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
    .select-box{
      display: flex;
      .takePhoto, .audio, .file, .link{
        margin-right: 9px;
        width: 77px;
        height: 77px;
        background: #FBFBFB;
        display: flex;
        align-items: center;
        justify-content: center;
        .icon{
          width: 23px;
          height: 23px;
        }
      }
      .link{
        margin-right: 0;
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
    .images {
      display: flex;
      margin: 0 -3px -6px;
      flex-flow: row wrap;
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
          line-height: 100px;
        }
        .close {
          position: absolute;
          right: 0;
          top: 2.5px;
          width: 26px;
          height: 26px;
          background-image: url(../../assets/icon/icon-close.png) top 100%;
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