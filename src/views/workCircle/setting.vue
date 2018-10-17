<template>
  <div class="setting">
    <div class="header" v-if="isOwner">
      <span class="head_txt">工作圈封面</span>
      <img class="head_img" :src="headerPhoto" alt="" />
    </div>
    <div class="circleName" v-if="isOwner">
      <span>工作圈名字</span>
      <span><input class="inp" type="text" v-model="name" /></span>
    </div>
    <div class="member" v-if="isOwner">
      <span>成员管理</span>
      <span class="tip">请前往PC端www.xplus.cn进行管理</span>
    </div>
    <div class="top">
      <span>置顶该工作圈</span>
      <inline-x-switch :value='isToTop' @on-change="changeStatus"></inline-x-switch>
    </div>
    <div class="top" v-if="!isOwner && !pageInfo.isMember">
      <span>关注该工作圈</span>
      <inline-x-switch :value='isFocus' @on-change="focus"></inline-x-switch>
    </div>
    <div class="saveBtn" @click.stop="save">保存</div>
  </div>
</template>

<script>
import { putStickApi, putNostickApi, putFocusApi, putNoFocusApi, putModifyApi, getCircleDetailApi } from '@/api/pages/workCircle'
import { InlineXSwitch } from 'vux'
export default {
  name: 'setting',
  components: {
    InlineXSwitch
  },
  data () {
    return {
      pageInfo: {},
      name: '',
      headerPhoto: '',
      isToTop: '',
      isFocus: true,
      isOwner: false
    }
  },
  methods: {
    /* 初始化函数 */
    async init () {
      const { id } = this.$route.query
      let res = await this.getCircleDetail(id)
      this.pageInfo = res.data
      this.headerPhoto = res.data.coverImg.middleUrl
      this.name = res.data.name
      this.isFocus = res.data.isAttention // 初始化关注
      this.isToTop = res.data.isTop // 初始化置顶
      this.isOwner = res.data.isOwner // 是否圈主
      console.log(this.$route.query)
    },
    /* 置顶工作圈 */
    changeStatus (val) {
      this.isToTop = val
    },
    /* 关注工作圈 */
    focus (val) {
      this.isFocus = val
    },
    /* 修改图片和圈名 */
    putModify () {
      let param = {
        name: this.name
      }
      putModifyApi()
    },
    /* 保存 */
    async save () {
      try {
        let isTop = JSON.parse(this.$route.query.isTop)
        /* 置顶操作 */
        if (this.isToTop !== isTop && this.isToTop) {
          await putStickApi(this.$route.query.id)
        } else if (this.isToTop !== isTop && !this.isToTop) {
          console.log(this.isToTop, isTop, this.isToTop !== this.$route.query.isTop)
          await putNostickApi(this.$route.query.id)
        }
        /* 关注操作 */
        if (!this.isFocus && !this.isOwner) {
          await putNoFocusApi(this.$route.query.id)
        }
        /* 修改名字或图片 */
        if (this.name !== this.$route.query.name || this.headerPhoto !== this.$route.query.coverImg) {
          let param = {
            name: this.name,
            id: this.$route.query.id
          }
          await putModifyApi(param)
        }
        this.$router.push({path: '/circleDetail', query: {id: this.$route.query.id}})
      } catch (err) {
        alert(err)
      }
    },
    /* 获取工作圈详情 */
    getCircleDetail (id) {
      return getCircleDetailApi(id)
    }
  },
  created () {
    this.init()
  }
}
</script>

<style lang="less" scoped>
.setting{
  font-size: 30px;/*px*/
  color: #354048;
  padding: 0 20px;
  .header{
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 95px;
    border-bottom: 1px solid #EDEDED;/*px*/
    >.head_txt{
      font-weight: 400;
    }
    >.head_img{
      width: 60px;
      height: 60px;
      border-radius: 4px;
    }
  }
  /*工作圈名字*/
  .circleName{
    height: 60px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #EDEDED;/*px*/
    .inp{
      border: none;
      text-align: right;
    }
  }
  /*成员管理*/
  .member{
    height: 60px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #EDEDED;/*px*/
    .tip{
      color: #929292;
      font-size: 26px;/*px*/
      font-weight: 300;
    }
  }
  /*置顶*/
  .top{
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #EDEDED;/*px*/
  }
  /*保存*/
  .saveBtn{
    height: 44px;
    text-align: center;
    line-height: 44px;
    font-size: 32px;/*px*/
    border-radius: 22px;
    color: #354048;
    font-weight: 400;
    margin: 50px 30px 0;
    background-color: #FFE266;
  }
}
</style>