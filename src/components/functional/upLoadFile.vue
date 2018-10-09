<template>
  <div class="upLoadFile">
    <!-- 遮罩层 -->
    <div class="cropper-container" v-show="panel">
      <img id="image" :src="base64Url" alt="Picture">
      <div class="btnBox">
        <div id="cancel" @click="cancel">取消</div>
        <div id="button" @click="commit">确定</div>
      </div>
    </div>
    <div class="upLoadImg" @click.stop="choseImg">
      <img :src="base64Url || fileUrl" alt="" id="image">
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
      base64Url: '' // 截图url
    }
  },
  methods: {
    choseImg () {
      let base64List = []
      this.wechatChooseImage().then(res => {
        console.log(res, '1111')
        this.wechatUploadImage(res).then(res0 => {
          console.log(res0)
        })
        // res.forEach((e, index) => {
        //   this.wechatGetLocalImgData(e).then(res0 => {
        //     console.log(res0, '2222')
        //     base64List.push(res0)
        //     this.base64Url = base64List[0]
        //     if (this.cropper) {
        //       this.cropper.replace(this.base64Url)
        //     }
        //     this.panel = true
        //   })
        // })
      })
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
    // 取消
    cancel () {
      this.panel = false
    },
    // 截图
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
      uploadApi(formData).then(res => {
        this.base64Url = base64url
        this.panel = false
      })
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