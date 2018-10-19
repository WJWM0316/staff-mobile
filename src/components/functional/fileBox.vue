<template>
  <div class="fileBox">
    <template v-if="isFile">
      <div class="content-file" @click.stop="fileOpen(item.url || item.accessory[0].url)">
        <img v-show="fileType === '.pdf'" class="file-logo" src="@/assets/suffix/pdf.png" />
        <img v-show="fileType === '.xls' || fileType === '.xlsx'" class="file-logo" src="@/assets/suffix/xls.png" />
        <img v-show="fileType === '.doc'" class="file-logo" src="@/assets/suffix/word.png" />
        <img v-show="fileType === '.ppt'" class="file-logo" src="@/assets/suffix/ppt.png" />
        <div class="file-desc">
          <p class="text">{{item.fileName || item.accessory[0].fileName}}</p>
          <p class="text">{{item.sizeM || item.accessory[0].sizeM}}</p>
        </div>
      </div>
    </template>
    <!--链接-->
    <div class="postLink" v-if="!isFile">
      <a @click.stop="" class="content-file" :href="item.url">
        <img v-show="true" class="file-logo" src="@/assets/icon/postLink.png" />
        <div class="file-desc">
          <p class="text">{{item.title || '链接'}}</p>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
export default{
  name: 'fileBox',
  props: {
    item: {
      type: Object
    },
    isFile: { // 是否文件类型，默认为文件
      type: Boolean,
      default: true
    },
    fileType: {
      type: String,
      default: ''
    }
  },
  methods: {
    fileOpen (url) {
      window.location.href = url
    }
  }
}
</script>

<style lang="less" scoped>
.fileBox{
  .content-file {
    margin-top: 10px;
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
  .postLink{
    .text{
      color: #111111 !important;
    }
  }
}
</style>