<template>
  <div class="fileBox" v-if="item">
    <template v-if="isFile">
      <a class="content-file" @click.stop="downLoad(fileType)">
        <img class="file-logo" :src="fileType.extension | fileCover" />
        <div class="file-desc">
          <p class="text fileText">{{fileType.fileName}}</p>
          <p class="text fileText">{{fileType.sizeM}}</p>
        </div>
      </a>
    </template>
    <!--链接-->
    <div class="postLink" v-if="!isFile">
      <div class="content-file" @click.stop="tolink">
        <img class="file-logo" src="@/assets/icon/postLink.png" />
        <div class="file-desc">
          <p class="linkText" v-if="item">{{item.title || '链接'}}</p>
        </div>
      </div>
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
    }
  },
  computed: {
    fileType () {
      if (this.item.accessory) {
        return this.item.accessory[0]
      } else {
        return this.item
      }
    }
  },
  methods: {
    /* 跳转链接 */
    tolink () {
      let url = this.inpLink
      if (url.indexOf('http') === -1) {
        url = 'http://' + url
      }
      if (this.item.url) {
        location.href = this.item.url
      } else {
        location.href = this.item
      }
    },
    downLoad (fileType) {
      const event = new MouseEvent('click')
      const a = document.createElement('a')
      a.href = fileType.url
      a.download = fileType.fileName || '下载'
      a.dispatchEvent(event)
    }
  }
}
</script>

<style lang="less" scoped>
.fileBox{
  width: 100%;
  height: 60px;
  padding: 7.5px 10px 8.5px;
  background: #F8F8F8;
  border-radius: 3px;
  box-sizing: border-box;
  .content-file {
    line-height: 18px;
    padding-left: 54px;
    position: relative;
    width: 100%;
    display: block;
    height: 100%;
    box-sizing: border-box;
    .file-logo {
      width: 44px;
      height: 44px;
      border-radius: 3px;
      position: absolute;
      top: 0;
      left: 0;
    }
    .file-desc {
      height: 44px;
      font-size: 14px;/*px*/
      color: #111111;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .text {
        font-size: 28px;/*px*/
        font-weight: 300;
        display: block;
        max-width: 261px;
        .setEllipsis();
      }
      .fileText{
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
    .linkText{
      font-size: 28px;/*px*/
      font-weight: 300;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box !important;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      color: #111111 !important;
    }
  }
}
</style>