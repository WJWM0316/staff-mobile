<template>
  <div class="punchList">
    <lessondynamicItem
       v-for="(item, index) in punchList"
       :key = "index"
       :item="item"
       @setPostTop="setPostTop"
    ></lessondynamicItem>
    <pullUpUi :noData="noData" :pullUpStatus="pullUpStatus" @pullUp="pullUp"></pullUpUi>
    <actionsheet v-model="addActionsConfig.show" :menus="isExcellentCard?addActionsConfig.menus2:addActionsConfig.menus" show-cancel @on-click-menu="handleAddActoinItem" />
  </div>
</template>

<script>
import { getCourseCardListApi, setExcellentCourseCardApi } from '@/api/pages/course'
import lessondynamicItem from '@c/business/dynamicItem'
import { Actionsheet } from 'vux'
export default {
  name: 'punchList',
  components: {
    lessondynamicItem,
    Actionsheet
  },
  data () {
    return {
      jsonData: { // 获取课节详情的筛选条件参数
        course_section_id: 1,
        order: {
          punch_card_time: 'desc'
        }
      },
      listPage: 1, // 当前打卡列表页数
      punchList: [],
      punchCount: '', // 当前打卡数量
      addActionsConfig: {
        show: false,
        menus: [{
          label: ' 选为优秀打卡 ',
          value: ' selected '
        }],
        menus2: [{
          label: ' 取消优秀打卡 ',
          value: ' disSelect '
        }]
      },
      nowChoosePunch: '',
      isExcellentCard: 0,
      noData: false,
      pullUpStatus: false
    }
  },
  methods: {
    /* 打卡列表 */
    getCourseCardListApi () {
      let { type, id } = this.$route.query
      console.log(type, id)
      this.jsonData.course_section_id = id
      let jsonDataString = JSON.stringify({search: this.jsonData})
      let UrlString = encodeURIComponent(jsonDataString)
      let param = {
        jsonData: UrlString,
        page: this.listPage,
        pageCount: 20,
        type: type === 'all' ? 2 : 1
      }
      return getCourseCardListApi(param)
    },
    async init () {
      let { type } = this.$route.query
      let res = await this.getCourseCardListApi()
      type === 'all' ? this.punchList = res.data.peopleCourseCardList : this.punchList = res.data.excellentPeopleCourseCardList
      this.punchCount = res.data.peopleCourseCardListCount
    },
    /* 置顶 */
    async setPostTop (item) {
      console.log(item)
      this.addActionsConfig.show = true
      this.nowChoosePunch = item
    },
    async handleAddActoinItem (key, item) {
      let param = {
        course_section_id: this.nowChoosePunch.courseSectionCardId,
        is_set_excellent_card: this.nowChoosePunch.isExcellentCard === 0 ? 1 : 0
      }
      if (item) {
        await setExcellentCourseCardApi(param)
        this.getCourseCardListApi()
        this.$toast({text: '设置优秀打卡成功', type: 'success'})
      }
    },
    async pullUp () {
      if (this.punchCount === this.punchList.length) {
        this.noData = true
        this.pullUpStatus = false
      } else {
        if (this.punchList.length === 0) return
        this.listPage += 1
        let res = await this.getCourseCardListApi()
        let { type } = this.$route.query
        type === 'all' ? this.punchList.push(...res.data.peopleCourseCardList) : this.punchList.push(...res.data.excellentPeopleCourseCardList)
      }
    }
  },
  created () {
    this.init()
  }
}
</script>

<style lang="less" scoped>
  .punchList{}
</style>