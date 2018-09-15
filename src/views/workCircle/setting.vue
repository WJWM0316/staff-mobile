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
    <div class="top" v-if="!isOwner">
      <span>关注该工作圈</span>
      <inline-x-switch :value='isFocus' @on-change="focus"></inline-x-switch>
    </div>
    <div class="saveBtn" @click.stop="save">保存</div>
  </div>
</template>

<script>
import { putStickApi, putNostickApi, putFocusApi, putNoFocusApi, putModifyApi } from '@/api/pages/workCircle'
import { InlineXSwitch } from 'vux'
export default {
  name: 'setting',
  components: {
    InlineXSwitch
  },
  data () {
    return {
      name: '',
      headerPhoto: '',
      isToTop: '',
      isFocus: true,
      isOwner: false
    }
  },
  methods: {
    /* 初始化函数 */
    init () {
      this.headerPhoto = this.$route.query.coverImg
      this.name = this.$route.query.name
      this.$route.query.isAttention ? this.isFocus = true : this.isFocus = false // 初始化关注
      this.$route.query.isTop === 1 ? this.isToTop = true : this.isToTop = false // 初始化置顶
      this.isOwner = this.$route.query.isOwner // 是否圈主
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
      console.log(this.name)
      try {
        /* 置顶操作 */
        if (this.isToTop && this.$route.query.isTop !== 1) {
          await putStickApi(this.$route.query.id)
        } else if (!this.isToTop && this.$route.query.isTop !== 0) {
          await putNostickApi(this.$route.query.id)
        }
        /* 关注操作 */
        if (!this.isFocus && !this.isOwner) {
          await putNoFocusApi(this.$route.query.id)
        }
        /* 修改名字或图片 */
        if (this.name !== this.$route.query.name || this.headerPhoto !== this.$route.query.coverImg) {}
      } catch (err) {
        alert(11111111111)
      }
      this.$router.push({path: '/workCircle/circleDetail', query: {id: this.$route.query.id}})
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