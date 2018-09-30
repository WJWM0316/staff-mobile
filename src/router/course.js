const routers = [
  {
    path: '/course',
    name: 'course',
    meta: { title: '选课', needBottomTab: true },
    component: resolve => require(['@/views/course/index'], resolve)
  },
  {
    path: '/course/detail',
    name: 'courseDetail',
    meta: { title: '课程详情' },
    component: resolve => require(['@/views/course/detail'], resolve)
  },
  {
    path: '/course/introduce',
    name: 'introduce',
    component: resolve => require(['@/views/course/introduce'], resolve)
  },
  {
    path: '/course/community',
    name: 'community',
    component: resolve => require(['@/views/course/community'], resolve)
  },
  {
    path: '/course/lesson',
    name: 'lesson',
    component: resolve => require(['@/views/course/lesson'], resolve)
  },
  {
    path: '/course/punchDetail',
    name: 'punchDetail',
    component: resolve => require(['@/views/course/punchDetail'], resolve)
  },
  {
    path: '/course/punchEditting',
    name: 'punchEditting',
    component: resolve => require(['@/views/course/punchEditting'], resolve)
  },
  {
    path: '/course/commentDetail',
    name: 'commentDetail',
    component: resolve => require(['@/views/course/commentDetail'], resolve)
  }
]

export default routers
