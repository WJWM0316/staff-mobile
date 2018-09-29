const routers = [
  {
    path: '/course',
    name: 'course',
    meta: { title: '选课', needBottomTab: true },
    component: resolve => require(['@/views/course/index'], resolve)
  },
  /* 课程介绍页 */
  {
    path: '/course/introduce',
    name: 'introduce',
    component: resolve => require(['@/views/course/introduce'], resolve)
  },
  /* 课程加入详情页 */
  {
    path: '/course/community',
    name: 'community',
    component: resolve => require(['@/views/course/community'], resolve)
  },
  /* 课节 */
  {
    path: '/course/lesson',
    name: 'lesson',
    component: resolve => require(['@/views/course/lesson'], resolve)
  },
  /* 打卡详情页 */
  {
    path: '/course/punchDetail',
    name: 'punchDetail',
    component: resolve => require(['@/views/course/punchDetail'], resolve)
  },
  /* 打卡编辑页 */
  {
    path: '/course/punchEditting',
    name: 'punchEditting',
    component: resolve => require(['@/views/course/punchEditting'], resolve)
  },
  /* 评论详情页 */
  {
    path: '/course/commentDetail',
    name: 'commentDetail',
    component: resolve => require(['@/views/course/commentDetail'], resolve)
  }
]

export default routers
