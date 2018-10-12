<template>
  <div class="downLoad">
    <div class="monthTitle" v-if="type === 1">
      <span>{{month}}</span>
      <span class="selectPic" v-if="type === 1">多选</span>
    </div>
    <pullUpUi :noData="all.noData" :pullUpStatus="all.pullUpStatus" @pullUp="pullUp"></pullUpUi>
    <!--图片-->
    <div class="picBox" v-for="(picItem, index) in nowFileList" :key="index" v-if="type === '1'">
      <img class="picItem" v-lazyload :src="picItem.fileInfo.smallUrl" />
    </div>
    <!--文件-->
    <div class="fileItemBox" v-for="(fileItem, index) in nowFileList" :key="index" v-if="type === '2'">
      <div class="fileTitle" v-if="fileItem.needShowTitle">{{fileItem.month}}</div>
      <div class="fileItemHeader">
        <div><img class="headerPhoto" :src="fileItem.avatarInfo.smallUrl"/><span>{{fileItem.realname}}</span></div>
        <div>{{fileItem.createdDay}}</div>
      </div>
      <file-box :item="fileItem.fileInfo" :isFile="isFile" :fileType='fileItem.fileType'></file-box>
    </div>
    <pullUpUi :noData="all.noData" :pullUpStatus="all.pullUpStatus" @pullUp="pullUp"></pullUpUi>
  </div>
</template>

<script>
import { getPictureApi, getFilesApi } from '@/api/pages/workCircle'
import fileBox from '@c/functional/fileBox'
export default {
  name: 'fileDownLoad',
  components: {
    fileBox
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
        list: [],
        page: 1,
        noData: false,
        pullUpStatus: false
      },
      type: 1, // 1:相册，2：文件，3：链接，默认进入的是相册下载
      isFile: '', // 是否文件
      fileType: '' // 文件的类型xml，或者其他
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
    /* 请求文件列表 */
    async getFiles (needLoading) {
      let param = {
        id: this.$route.query.id,
        page: this.nowPage,
        count: 20
      }
      let res = await getFilesApi(param, needLoading)
      res.data.map((item, index) => {
        let result = item.fileInfo.fileName.match(/\.[^\.]+/)
        item.fileType = result[0]
        if (index === 0 || item.month === res.data[index + 1].month) {
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
      console.log(this.nowFileList)
    },
    /* 分类请求 type：1为相册，2为文件，3为链接 */
    async classifyPost (needLoading) {
      this.type = await this.$route.query.type
      if (this.type === '1') {
        this.month = this.$route.query.item
        this.getPicture(needLoading)
      } else if (this.type === '2') {
        this.isFile = true
        this.getFiles(needLoading)
      } else {
        this.isFile = false
      }
    },
    init () {
      this.classifyPost(true)
    },
    /* 滚动触发事件 */
    async pullUp () {
      if (this.isLastPage) {
        console.log(' 111111 ')
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
    }
  },
  created () {
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
    }
  }
  .fileItemBox{
    padding: 0 20px;
    .fileItemHeader{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 15px;
      font-size: 28px;/*px*/
      .headerPhoto{
        border-radius: 50%;
        width: 32px;
        height: 32px;
        margin-right: 8px;
      }
    }
    .fileTitle{
      margin-right: -20px;
      margin-left: -20px;
      padding: 0 20px;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #EEEEEE;/*px*/
    }
  }
</style>