<template>
  <div class="upLoadFile">
    <!-- 遮罩层 -->
    <div class="cropper-container" v-show="panel">
      <img id="image" :src="url" alt="Picture">
      <div class="btnBox">
        <div id="cancel" @click="cancel">取消</div>
        <div id="button" @click="commit">确定</div>
      </div>
    </div>
    <div class="upLoadImg" @click.stop="choseImg">
      <img :src="base64Url" alt="" id="image">
    </div>
  </div>
</template>
<script>
import { uploadApi } from '@/api/common'
import WechatMixin from '@/mixins/wechat'
import Cropper from 'cropperjs'
export default {
  mixins: [WechatMixin],
  components: {
  },
  props: {
    attach_type: {
      type: String,
      default: ''
    },
    fileUrl: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      headerImage: '',
      picValue: '',
      cropper: '',
      croppable: false,
      panel: false,
      url: '',
      base64Url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAAAbCAYAAAAj4uLUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFySURBVFhH7ZYxrsMgDEB7/+PkAOwcgJ2dndW1SQiGOCREtFL/9/Ak2hCwnw3tK8YI/x2VgKgERCUgKgFRCch8Cd6CcUF+lvBglwWWSyx48f353JeAyVVBWi/PQ4IztYgLMd4acEF+lvF2uZBboLk8VuvleZlHEs4Wpc3zs5IYVt44CPu8AM7UQcrUnTAiIXEj3sy4hE4HcAm97wqrkKsgiUN33SB3xHQJ0oI50UPC9A5K4wnkwG7BOuiJhF7MnEEJ0tmlaq6tW0kIDsyeBF2G7UWH7zm5qyjhNvBHEiiGr0jYqk3jXULavE66TYw+HyrP+CkJvPpp7GhjQRbvDBxbgxJO7hepEx7xGQn9G3o9760AOi7suyxjW++MNvC0dudSlsjdNl0Cv6wK5Q/QccP6PvB2G7Nj1CJ1wriE8lM8XwLCu4FX/+yci90z2Amj8Fg+IiEx2JrfpC3GPAl/GJWAqAREJSAqAVEJiEpAVAKiEmKENwOKGSM7DyjHAAAAAElFTkSuQmCC'
    }
  },
  methods: {
    choseImg () {
      let base64List = []
      // this.wechatChooseImage().then(res => {
      //   res.forEach((e, index) => {
      //     this.wechatGetLocalImgData(e).then(res0 => {
      //       base64List.push(res0)
      //       this.option.img = base64List[index]
      //       this.isShowCropper = true
      //     })
      //   })
      // })
      this.url = this.getObjectURL(this.convertBase64UrlToBlob(this.base64Url))
      console.log(this.url)
      if (this.cropper) {
        this.cropper.replace(this.url)
        console.log(111)
      }
      this.panel = true
    },
    // 将base64的图片转换为file文件
    convertBase64UrlToBlob (urlData) {
      let bytes = window.atob(urlData.split(',')[1]) // 去掉url的头，并转换为byte
      // 处理异常,将ascii码小于0的转换为大于0
      let ab = new ArrayBuffer(bytes.length)
      let ia = new Uint8Array(ab)
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
      }
      return new Blob([ab], { type: 'image/jpeg' })
    },
    // dataUrl 转 file
    dataURLtoFile (dataurl, filename = 'file') {
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let suffix = mime.split('/')[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], `${filename}.${suffix}`, {type: mime})
    },
    getObjectURL (file) {
      var url = null
      if (window.createObjectURL !== undefined) {
        url = window.createObjectURL(file)
      } else if (window.URL !== undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL !== undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
    cancel () {
      this.panel = false
    },
    commit () {
      let newImG = this.cropper.getCroppedCanvas({
        width: 240,
        height: 240,
        fillColor: '#fff',
        imageSmoothingEnabled: false,
        imageSmoothingQuality: 'high'
      })
      let base64url = newImG.toDataURL('image/jpeg')
      let blob = this.dataURLtoFile(base64url)
      let formData = new FormData()
      formData.append('attach_type', this.attach_type)
      formData.append('img1', blob)
      setTimeout(res => {
        return uploadApi(formData)
      }, 500)
      // this.base64Url = base64url
      // this.panel = false
    }
  },
  mounted () {
    // 初始化这个裁剪框
    var self = this
    var image = document.getElementById('image')
    this.cropper = new Cropper(image, {
      cropBoxResizable: false,
      checkCrossOrigin: false,
      aspectRatio: 1,
      viewMode: 0,
      initialAspectRatio: 200,
      background: false,
      minCropBoxWidth: 650,
      minCropBoxHeight: 650,
      crop (event) {
      },
      ready () {
      }
    })
  }
}
</script>
<style lang="less">
@import url('../../styles/cropper.less');
#image {
  max-width: 100%;
}
.upLoadFile {
  .upLoadImg {
    width: 100%;
    height: 100%;
    background: #000;
  }
  .cropper-container {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    .btnBox {
      width: 100%;
      padding: 0 30px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      position: absolute;
      left: 0;
      bottom: 40px;
      font-size: 16px;
      color: #fff;
      z-index: 100;
    }
  }
}
</style>