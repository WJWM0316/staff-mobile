<template>
  <div class="upLoadFile">
    <div class="upLoadImg" @click.stop="choseImg">
      <img :src="fileUrl" alt="" crossOrigin='Anonymous'>
    </div>
    <!-- vueCropper 剪裁图片实现-->
    <div class="vue-cropper-box"
        v-if="isShowCropper">
      <div class="vue-cropper-content">
        <vueCropper ref="cropper"
                    :img="option.img"
                    :outputSize="option.outputSize"
                    :outputType="option.outputType"
                    :info="option.info"
                    :canScale="option.canScale"
                    :autoCrop="option.autoCrop"
                    :autoCropWidth="option.autoCropWidth"
                    :autoCropHeight="option.autoCropHeight"
                    :fixed="option.fixed"
                    :fixedNumber="option.fixedNumber">
        </vueCropper>
      </div>
      <div v-if="isShowCropper"
           type="danger"
           @click="onCubeImg">确定裁剪图片
      </div>
    </div>
  </div>
</template>
<script>
import VueCropper from 'vue-cropper'
import { uploadApi } from '@/api/common'
import WechatMixin from '@/mixins/wechat'
export default {
  mixins: [WechatMixin],
  components: {
    VueCropper
  },
  props: {
    fileUrl: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 裁剪组件的基础配置option
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 150, // 默认生成截图框宽度
        autoCropHeight: 150, // 默认生成截图框高度
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [400, 400] // 截图框的宽高比例
      },
      isShowCropper: false, // 是否显示截图框
      fileUpload: null,
      fileinfo: {},
      form: {}
    }
  },
  methods: {
    choseImg () {
      let base64List = []
      this.wechatChooseImage().then(res => {
        res.forEach((e,index) => {
          this.wechatGetLocalImgData(e).then(res0 => {
            base64List.push(res0)
            this.option.img = base64List[index]
            this.isShowCropper = true
          })
        })
      })
    },
    // 确定裁剪图片
    onCubeImg () {
      // 获取cropper的截图的base64 数据
      this.$refs.cropper.getCropData(data => {
        this.fileinfo.url = data
        this.isShowCropper = false
        // 先将显示图片地址清空，防止重复显示
        this.option.img = ''
        // 将剪裁后base64的图片转化为file格式
        let file = this.convertBase64UrlToBlob(data)
        file.name = this.fileUpload.name
        // 将剪裁后的图片执行上传
        this.uploadFile(file).then(res => {
          this.form.content = res.file_id // 将上传的文件id赋值给表单from的content
        })
      })
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
    }
  }
}
</script>
<style lang="less" scoped>
.upLoadFile {
  .upLoadImg {
    width: 100%;
    height: 100%;
  }
  .vue-cropper-box {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    .vue-cropper-content {
      width: 100%;
      height: 100%;
    }
  }
}
</style>