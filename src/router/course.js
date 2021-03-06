const routers = [
  {
    path: '/course',
    name: 'course',
    meta: { title: '选课', needBottomTab: true, keepAlive: true, pullDown: true },
    component: resolve => require(['@/views/course/index'], resolve)
  },
  {
    path: '/myCourse',
    name: 'myCourse',
    meta: { title: '我的课程', keepAlive: true },
    component: resolve => require(['@/views/course/myCourse'], resolve)
  },
  {
    path: '/courseDetail',
    name: 'courseDetail',
    meta: { title: '课程详情' },
    component: resolve => require(['@/views/course/detail'], resolve)
  },
  {
    path: '/courseIntroduction',
    name: 'courseIntroduction',
    meta: { title: '课程介绍页' },
    component: resolve => require(['@/views/course/detail'], resolve)
  },
  {
    path: '/courseLesson',
    name: 'lesson',
    meta: { title: '课节详情' },
    component: resolve => require(['@/views/course/lesson'], resolve)
  },
  {
    path: '/punchDetail',
    name: 'punchDetail',
    meta: { title: '打卡详情' },
    component: resolve => require(['@/views/course/punchDetail'], resolve)
  },
  {
    path: '/punchEdit',
    name: 'cardEdit',
    meta: { title: '打卡', reload: true },
    component: resolve => require(['@/views/course/punchEditting'], resolve)
  },
  {
    path: '/commentDetail',
    name: 'commentDetail',
    meta: { title: '评论详情' },
    component: resolve => require(['@/views/course/commentDetail'], resolve)
  },
  {
    path: '/memberList',
    name: 'memberList',
    meta: { title: '成员列表' },
    component: resolve => require(['@/views/course/memberList'], resolve)
  },
  {
    path: '/punchList',
    name: 'punchList',
    meta: { title: '打卡列表' },
    component: resolve => require(['@/views/course/punchList'], resolve)
  }
]

export default routers
