<template>
  <div class="upLoadFile">
    <!-- 遮罩层 -->
    <div class="cropper-container" v-show="panel">
      <img id="image" :src="fileUrl[fileUrl.length - 1]" alt="Picture">
      <div class="btnBox">
        <div id="cancel" @click="cancel">取消</div>
        <div id="button" @click="commit">确定</div>
      </div>
    </div>
    <div class="upLoadFileBox">
      <template v-if="attach_type !== 'img' || !isWeiXin">
        <slot name="img"></slot>
        <img v-if="fileUrl[fileUrl.length - 1]" :src="fileUrl[fileUrl.length - 1]" alt="" id="image">
        <img v-else :src="imgUrl" alt="" id="image">
        <input class="upLoadBtn"
          @change="choseFile"
          ref="upLoadBtn"
          type="file"
          :multiple="isMultiple && multiple"
          :accept="acceptType"
        />
      </template>
      <template v-else>
        <div class="upLoadBtn wxUpLoadBtn" @click="wxChoseImg">
          <slot name="img"></slot>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import { uploadApi, uploadFileApi } from '@/api/common'
import WechatMixin from '@/mixins/wechat'
import Cropper from 'cropperjs'
export default {
  mixins: [WechatMixin],
  components: {
  },
  props: {
    attach_type: {
      type: String,
      default: '' // 附件类型。头像类型传递 avatar, 其他图片 img，音频 audio，视频 video， 文档 doc，压缩文件 compress
    },
    imgUrl: {
      type: String,
      default: '' // 默认图片
    },
    count: { // 用于微信图片选择的数量
      type: Number,
      default: 9
    },
    multiple: {
      type: Boolean,
      default: true // 需要多选
    }
  },
  computed: {
    isMultiple () {
      if (this.attach_type === 'img') {
        return true
      } else {
        return false
      }
    },
    acceptType () {
      switch (this.attach_type) {
        case 'avatar':
          return 'image/*'
        case 'img':
          return 'image/*'
        case 'audio':
          return 'audio/*'
        case 'video':
          return 'video/*'
        case 'compress':
          return 'aplication/zip'
        case 'doc':
          return 'text/*, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.openxmlformats-officedocument.spreadsheetml.template, application/vnd.openxmlformats-officedocument.presentationml.template, application/vnd.openxmlformats-officedocument.presentationml.slideshow, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.presentationml.slide, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.wordprocessingml.template, application/vnd.ms-excel.addin.macroEnabled.12, application/vnd.ms-excel.sheet.binary.macroEnabled.12, text/xml, application/xml, application/vnd.ms-excel, application/vnd.ms-works, application/vnd.ms-powerpoint, application/vnd.ms-powerpoint, application/vnd.ms-powerpoint, application/msword, application/vnd.ms-excel'
      }
    },
    /* 是否微信环境 */
    isWeiXin () {
      let ua = window.navigator.userAgent.toLowerCase()
      if (ua.match(/MicroMessenger/i) && ua.match(/MicroMessenger/i)[0] === 'micromessenger') {
        return true
      } else {
        return false
      }
    }
  },
  data () {
    return {
      headerImage: '',
      picValue: '',
      cropper: '',
      croppable: false,
      panel: false,
      fileUrl: [], // 文件file
      uploadList: []
    }
  },
  methods: {
    choseFile (e) {
      let files = e.target.files // 返回来的是一个对象
      let URL = window.URL || window.webkitURL
      this.fileUrl = [] // 清空列表
      for (let i in files) {
        if (i !== 'length' && i !== 'item') {
          if (this.attach_type === 'avatar') {
            this.fileUrl.push(URL.createObjectURL(files[i]))
          } else {
            this.fileUrl.push(files[i])
          }
        }
      }
      // 开启截图
      if (this.attach_type === 'avatar') {
        if (this.cropper) {
          this.cropper.replace(this.fileUrl[files.length - 1])
        }
        this.panel = true
      } else {
        let formData = new FormData()
        formData.append('attach_type', this.attach_type)
        this.fileUrl.forEach((e, index) => {
          formData.append(`file${index}`, e)
        })
        uploadApi(formData).then(res => {
          this.$toast({
            text: '上传成功',
            type: 'success'
          })
          this.$emit('upLoadResult', res.data)
        })
      }
    },
    wxChoseImg () {
      this.getWechatSign()
      let option = {
        count: this.count
      }
      this.wechatChooseImage(option).then(async res => {
        this.$emit('choseResult', res) // 选择图片的结果
        for (let i = 0; i < res.length; i++) {
          let res0 = await this.wechatUploadImage(res[i])
          let data = {
            mediaId: res0.serverId,
            type: 'img'
          }
          let res1 = await this.wxUploadFile(data)
          this.uploadList.push(res1.data[0])
        }
        // alert(JSON.stringify(this.uploadList))
        this.$emit('upLoadResult', this.uploadList) // 上传图片的结果
      }).catch(res => {
        console.log(JSON.stringify(res))
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
      this.$refs.upLoadBtn.value = '' // 清除变化
      this.fileUrl = []
      this.cropper.reset()
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
      let fileUrl = newImG.toDataURL('image/jpeg')
      let blob = this.dataURLtoFile(fileUrl)
      let formData = new FormData()
      formData.append('attach_type', this.attach_type)
      formData.append('avatar', blob)
      uploadApi(formData).then(res => {
        this.$emit('upLoadResult', res.data)
        this.fileUrl = []
        this.fileUrl.push(res.data[0].url)
        this.panel = false
        this.$refs.upLoadBtn.value = '' // 清除变化
        this.cropper.reset()
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
      cropBoxMovable: false,
      aspectRatio: 1,
      viewMode: 1,
      dragMode: 'move',
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
  .upLoadFileBox {
    width: 100%;
    height: 100%;
    position: relative;
    .upLoadBtn {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      .icon{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        width: 25px;
        height: 25px;
      }
    }
    .wxUpLoadBtn{
      opacity: 1;
    }
    .imgIcon{
      width: 25px;
      height: 25px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
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