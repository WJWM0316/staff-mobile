const routers = [
  {
    path: '/course',
    name: 'course',
    meta: { title: '选课', needBottomTab: true },
    component: resolve => require(['@/views/course/index'], resolve)
  },
  {
    path: '/courseDetail',
    name: 'courseDetail',
    meta: { title: '课程详情' },
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
    component: resolve => require(['@/views/course/punchDetail'], resolve)
  },
  {
    path: '/punchEdit',
    name: 'cardEdit',
    component: resolve => require(['@/views/course/punchEditting'], resolve)
  },
  {
    path: '/commentDetail',
    name: 'commentDetail',
    component: resolve => require(['@/views/course/commentDetail'], resolve)
  }
]

export default routers
