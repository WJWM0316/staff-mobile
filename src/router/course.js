const routers = [
  {
    path: '/course',
    name: 'courseIndex',
    meta: { title: '选课', needBottomTab: true },
    component: resolve => require(['@/views/course/index'], resolve)
  },
  {
    path: '/course/detail',
    name: 'detail',
    component: resolve => require(['@/views/course/detail'], resolve)
  }
]

export default routers
