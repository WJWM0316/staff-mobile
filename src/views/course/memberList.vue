<template>
  <div class="memberList">
    <div class="title" v-if="teacherList.length > 0">
      <i class="icon iconfont icon-mypage_homepage"></i>
      <span class="txt">导师</span>
    </div>
    <classmateItem v-for="(item, index) in teacherList" :key="'teacher'+index" :item="item"></classmateItem>
    <div class="title" v-if="excellentList.length > 0">
      <i class="icon iconfont icon-icon_list_gm"></i>
      <span class="txt">优秀成员</span>
      <i class="icon iconfont icon-btn_inf_outstanding" @click.stop="showMask"></i>
    </div>
    <classmateItem v-for="(item, index) in excellentList" :key="'excellent'+index" :item="item" :index="index"></classmateItem>
    <div class="title" v-if="studentList.length > 0">
      <i class="icon iconfont icon-icon_list_number"></i>
      <span class="txt">成员列表</span>
    </div>
    <classmateItem v-for="(item, index) in studentList" :key="'student'+index" :item="item"></classmateItem>
    <pullUpUi :noData="noData" :pullUpStatus="pullUpStatus" @pullUp="pullUp"></pullUpUi>
    <!--链接输入弹窗-->
    <div class="Mask" v-if="showRule">
      <div class="ruleTxt">
        <h3 class="ruleTitle">如何成为优秀学员</h3>
        <p>1、积极听课，完成每节课的打 卡内容；</p>
        <p>2、如果你的打卡内容写的很棒 的话，就会被导师选为“优秀打 卡”；</p>
        <p>3、累计“优秀打卡”个数前三名 的，就能成为优秀学员；</p>
        <div class="linkBtn" @click.stop="done">我知道了</div>
      </div>
    </div>
  </div>
</template>
<script>
import classmateItem from '@c/business/classmateItem'
import { getCirclePeopleListApi } from '@/api/pages/course'
export default {
  components: {
    classmateItem
  },
  data () {
    return {
      teacherList: [],
      excellentList: [],
      studentList: [],
      noData: false,
      page: 1,
      pullUpStatus: false,
      showRule: false // 展示成员优秀学员规则框
    }
  },
  methods: {
    getStudentList ({page, count}, needLoading) {
      return new Promise((resolve, reject) => {
        let data = {
          id: this.$route.query.id,
          page: page || 1,
          count: count || 20
        }
        getCirclePeopleListApi(data, needLoading).then(res => {
          this.teacherList = this.teacherList.concat(res.data.role)
          this.excellentList = this.excellentList.concat(res.data.excellent)
          this.studentList = this.studentList.concat(res.data.peoples)
          if (res.data.peopleTotal === this.studentList.length) {
            this.noData = true
          }
          resolve(res)
        })
      })
    },
    pullUp () {
      this.page++
      this.pullUpStatus = true
      this.getStudentList({page: this.page}, false).then(res => {
        this.pullUpStatus = false
      })
    },
    showMask () {
      this.showRule = true
    },
    done () {
      this.showRule = false
    }
  },
  created () {
    this.getStudentList({page: 1})
  }
}
</script>
<style lang="less">
.memberList {
  padding: 0 20px;
  .title {
    display: flex;
    align-items: center;
    font-size: 0;
    padding-top: 20px;
    &:nth-of-type(3), &:nth-of-type(5){
        padding-top: 50px;
    }
    .icon {
      font-size: 50px; /*px*/
      color: #BCBCBC;
      padding-right: 10px;
    }
    .icon-btn_inf_outstanding{
      color: #DCDCDC;
    }
    .txt {
      padding-right: 6px;
      font-size: 30px;  /*px*/
      color: #929292;
      font-weight: 700;
    }
  }
  .Mask{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background:rgba(0,0,0,0.5);
      z-index: 8888;
      .ruleTxt{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        box-sizing: border-box;
        padding: 25px;
        .ruleTitle{
          margin-bottom: 10px;
        }
        >p{
          color: #666666;
          font-size: 32px;/*px*/
          text-align: left;
        }
        text-align: center;
        border-radius: 4px;
        width: 280px;
        height: 301px;
        background: #FFFFFF;
        color: #666666;
        .linkBtn{
          margin-top: 38px;
          font-size: 34px;/*px*/
          color: #D7AB70;
        }
      }
    }
}
</style>