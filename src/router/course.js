const routers = [
  {
    path: '/course',
    name: 'course',
    meta: { title: '选课', needBottomTab: true },
    component: resolve => require(['@/views/course/index'], resolve)
  }
]

export default routers
