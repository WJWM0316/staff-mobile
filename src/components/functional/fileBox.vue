<template>
  <div class="fileBox">
    <template v-if="isFile">
      <div class="content-file" @click.stop="fileOpen(fileType.url)">
        <img class="file-logo" :src="fileType.extension | fileCover" />
        <div class="file-desc">
          <p class="text fileText">{{fileType.fileName}}</p>
          <p class="text fileText">{{fileType.sizeM}}</p>
        </div>
      </div>
    </template>
    <!--链接-->
    <div class="postLink" v-if="!isFile">
      <a @click.stop="toLink" class="content-file" :href="item.url">
        <img v-show="true" class="file-logo" src="@/assets/icon/postLink.png" />
        <div class="file-desc">
          <p class="text linkText">{{item.title || '链接'}}</p>
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
    fileOpen (url) {
      console.log(11111111111111)
      window.location.href = url
    },
    toLink () {}
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
      overflow:hidden; 
      text-overflow:ellipsis;
      display:-webkit-box !important; 
      -webkit-box-orient:vertical;
      -webkit-line-clamp:2; 
      color: #111111 !important;
    }
  }
}
</style>