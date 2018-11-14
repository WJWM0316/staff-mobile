<template>
  <div class="downLoad">
    <div class="monthTitle" v-if="type === 1">
      <span>{{month}}</span>
      <!--<span class="selectPic" v-if="type === 1" @click.stop="selectPic">多选<span v-if="showSelect">({{selectPicList.length}})</span></span>-->
    </div>
    <!--图片-->
    <template v-if="type === 1">
      <div v-if="nowFileList.length > 0" v-preview="true">
        <div class="picBox" v-for="(picItem, index) in nowFileList" :key="index" @click.stop="isSelect(picItem)">
          <div class="chooseImg" v-if="showSelect" :class="{'isChoose': picItem.chooseIndex}"><img v-if="picItem.chooseIndex" src="@/assets/icon/photo_selected@3x.png" /></div>
          <img class="picItem" v-lazyload :src="picItem.fileInfo.middleUrl" :data-src="picItem.fileInfo.url" v-if="picItem.type === '图片'"/>
          <div class="playVideo" v-else>
            <!--<div class="videoBOx" @click.stop="play" v-if="!videoPlay"><i class="icon iconfont icon-play_vidio"></i></div>-->
            <video class="video" :poster="picItem.fileInfo.coverImg.url" controls ref="video">
              <source :src="picItem.fileInfo.url" type="video/mp4">
                 您的浏览器不支持 HTML5 video 标签，请升级浏览器或者更换浏览器。
            </video>
          </div>
        </div>
      </div>
      <pullUpUi :noData="all.noData" :pullUpStatus="all.pullUpStatus" @pullUp="pullUp"></pullUpUi>
    </template>
    <!--文件和链接-->
    <template v-if="type === 2 || type === 3">
      <div class="fileItemBox" v-for="(fileItem, index) in nowFileList" :key="index">
        <div class="fileTitle" v-if="fileItem.needShowTitle">{{fileItem.month}}</div>
        <div class="fileItemHeader">
          <div><img class="headerPhoto" :src="fileItem.avatarInfo.smallUrl"/><span class="fileName">{{fileItem.realname}}</span></div>
          <div class="fileCreatedTime">{{fileItem.createdDay}}</div>
        </div>
        <!--文件-->
        <file-box v-if="type === 2" :item="fileItem.fileInfo" :isFile="isFile" :fileType='fileItem.fileType'></file-box>
        <!--链接-->
        <file-box v-if="type === 3" :item="fileItem" :isFile="isFile" :fileType='fileItem.fileType'></file-box>
      </div>
    </template>
    <pullUpUi :noData="all.noData" :pullUpStatus="all.pullUpStatus" @pullUp="pullUp"></pullUpUi>
    <nodata-box v-if="nowFileList.length === 0"></nodata-box>
    <div class="saveBtn" v-if="showSelect" @click.stop="savePic">保存到本地相册</div>
  </div>
</template>

<script>
import { getPictureApi, getFilesApi, getUrlsApi } from '@/api/pages/workCircle'
import fileBox from '@c/functional/fileBox'
import nodataBox from '@c/business/nodataBox'
export default {
  name: 'fileDownLoad',
  components: {
    fileBox,
    nodataBox
  },
  props: {
    item: {
      type: Object
    }
  },
  data () {
    return {
      nowFileList: [], // 图片列表
      month: '', // 月份标题
      nowPage: 1, // 当前页码
      isLastPage: false, // 是否最后一页
      all: {
        noData: false,
        pullUpStatus: false
      },
      type: 1, // 1:相册，2：文件，3：链接，默认进入的是相册下载
      isFile: '', // 是否文件
      fileType: '', // 文件的类型xml，或者其他
      showSelect: false, // 是否展示图片选择圈
      selectPicList: [], // 选中的图片列表
      videoPlay: false
    }
  },
  methods: {
    /* 获取指定月份的相册 */
    async getPicture (needLoading) {
      let param = {
        id: this.$route.query.id,
        page: this.nowPage,
        count: 30,
        month: this.$route.query.month
      }
      let res = await getPictureApi(param, needLoading)
      res.meta.currentPage === res.meta.lastPage ? this.isLastPage = true : this.isLastPage = false
      if (this.nowPage === 1) {
        this.nowFileList = res.data
      } else {
        this.nowFileList.push(...res.data)
      }
    },
    /* 请求文件列表 或链接列表 */
    async getFiles (needLoading) {
      let param = {
        id: this.$route.query.id,
        page: this.nowPage,
        count: 20
      }
      let res = {}
      if (this.type === 2) {
        res = await getFilesApi(param, needLoading)
      } else {
        res = await getUrlsApi(param, needLoading)
      }
      res.data.map((item, index) => {
        if (this.type === 2) {
          let result = item.fileInfo.fileName.match(/\.[^\.]+/)
          item.fileType = result[0]
        }
        if (index === 0 || (index > 0 && item.month !== res.data[index - 1].month)) {
          item.needShowTitle = true
        } else {
          item.needShowTitle = false
        }
        return item
      })
      res.meta.currentPage === res.meta.lastPage ? this.isLastPage = true : this.isLastPage = false
      if (this.nowPage === 1) {
        this.nowFileList = res.data
      } else {
        this.nowFileList.push(...res.data)
      }
    },
    /* 分类请求 type：1为相册，2为文件，3为链接 */
    classifyPost (needLoading) {
      if (this.type === 1) {
        this.month = this.$route.query.item
        this.getPicture(needLoading)
      } else if (this.type === 2) {
        this.isFile = true
        this.getFiles(needLoading)
      } else {
        this.isFile = false
        this.getFiles(needLoading)
      }
    },
    init () {
      this.classifyPost(true)
    },
    /* 滚动触发事件 */
    async pullUp () {
      if (this.isLastPage) {
        this.all.pullUpStatus = false
        this.all.noData = true
      } else {
        if (this.nowFileList.length <= 0) {
          return
        }
        this.all.pullUpStatus = true
        this.nowPage += 1
        await this.getPicture(false)
        this.all.pullUpStatus = false
      }
    },
    /* 激活选择图片(暂时屏蔽需求) */
    selectPic () {
      this.showSelect = !this.showSelect
    },
    /* 选择图片 */
    isSelect (pic) {
      if (!this.showSelect) return
      let isListIndex = ''
      this.selectPicList.forEach((item, index) => {
        if (pic.id === item.id) {
          isListIndex = index
        }
      })
      isListIndex !== '' ? this.selectPicList.splice(isListIndex, 1) : this.selectPicList.push(pic)
      this.nowFileList.forEach((item, index) => {
        if (item.id === pic.id) {
          item.chooseIndex = true
        }
      })
    },
    play () {
      this.videoPlay = true
      console.log(this.$refs['video'])
      this.$refs['video'].play()
    }
  },
  created () {
    this.type = parseInt(this.$route.query.type)
    this.init()
  }
}
</script>

<style lang="less" scoped>
  .monthTitle{
    font-size: 30px;/*px*/
    border-bottom: 1px solid #F7F7F7;
    color: #354048;
    height: 49px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .selectPic{
      font-size: 30px;/*px*/
      font-weight: 600;
      color: #D7AB70;
    }
  }
  .picBox{
    position: relative;
    display: inline-block;
    .picItem{
      width: 90px;
      height: 90px;
      margin-left: 3px;
      margin-bottom: 3px;
      object-fit: cover;
      vertical-align: middle;
    }
    .chooseImg{
      position: absolute;
      right: 5px;
      top: 5px;
      width: 21px;
      height: 21px;
      z-index: 10;
      border-radius: 50%;
      background: rgba(255,255,255,0.5);
      border: 1px solid #FFFFFF;
    }
    .isChoose{
      text-align: center;
      background: #FFE266;
      font-size: 28px;/*px*/
      color: #354048;
    }
    .playVideo{
      position: relative;
      .videoBOx{
        margin-left: 3px;
        box-sizing: border-box;
        width: 90px;
        height: 90px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9998;
        background-color: #000000;
        i{
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
          font-size: 20px;
          color: #FFFFFF;
          z-index: 9999;
        }
      }
      .video{
        width: 90px;
        height: 90px;
        margin-left: 3px;
        margin-bottom: 3px;
      }
    }
  }
  .fileItemBox{
    padding: 0 20px;
    .fileItemHeader{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 30px;
      font-size: 28px;/*px*/
     .fileCreatedTime{
       color: #BCBCBC;
     }
     .fileName{
       color: #666666;
     }
      .headerPhoto{
        border-radius: 50%;
        width: 32px;
        height: 32px;
        margin-right: 8px;
      }
    }
    .fileTitle{
      color: #666666;
      margin-right: -20px;
      margin-left: -20px;
      padding: 30px 20px 15px;
      /*height: 50px;*/
      /*line-height: 50px;*/
      border-bottom: 1px solid #EEEEEE;/*px*/
    }
  }
  .saveBtn{
    width: 100%;
    height: 49px;
    line-height: 49px;
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: center;
    background: #FFE266;
    font-size: 30px;/*px*/
    color: #354048;
  }
</style>