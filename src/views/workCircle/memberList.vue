<template>
  <div class="memberList">
    <div class="title" v-if="teacherList.length > 0">
      <i class="icon iconfont icon-mypage_homepage"></i>
      <span class="txt">圈主</span>
    </div>
    <classmateItem v-for="(item, index) in teacherList" :key="'teacher'+index" :item="item"></classmateItem>
    <div class="title" v-if="studentList.length > 0">
      <i class="icon iconfont icon-icon_list_number"></i>
      <span class="txt">成员列表</span>
    </div>
    <classmateItem v-for="(item, index) in studentList" :key="'student'+index" :item="item"></classmateItem>
    <pullUpUi :noData="noData" :pullUpStatus="pullUpStatus" @pullUp="pullUp"></pullUpUi>
  </div>
</template>
<script>
import classmateItem from '@c/business/classmateItem'
import { circleMemberListApi, circleTutorInfoApi } from '@/api/pages/workCircle'
export default {
  components: {
    classmateItem
  },
  data () {
    return {
      teacherList: [],
      studentList: [],
      noData: false,
      page: 1,
      pullUpStatus: false
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
        circleMemberListApi(data, needLoading).then(res => {
          this.studentList = this.studentList.concat(res.data)
          if (res.meta.currentPage === res.meta.lastPage) {
            this.noData = true
          }
          resolve(res)
        })
      })
    },
    circleTutorInfo ({page, count}, needLoading) {
      return new Promise(() => {
        let data = {
          id: this.$route.query.id
        }
        circleTutorInfoApi(data, needLoading).then(res => {
          this.teacherList = this.teacherList.concat(res.data)
        })
      })
    },
    pullUp () {
      this.page++
      this.pullUpStatus = true
      this.getStudentList({page: this.page}, false).then(res => {
        this.pullUpStatus = false
      })
    }
  },
  created () {
    this.circleTutorInfo({page: 1})
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
    &:nth-of-type(3){
      padding-top: 50px;
    }
    .icon {
      font-size: 40px !important; /*px*/
      color: #929292;
      padding-right: 10px;
    }
    .txt {
      font-size: 30px;  /*px*/
      color: #929292;
      font-weight: 700;
    }
  }
}
</style>