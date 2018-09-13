const routers = [
  {
    path: '/workCircle',
    name: 'workCircleIndex',
    meta: { title: '工作圈', needBottomTab: true },
    component: resolve => require(['@/views/workCircle/index'], resolve)
  },
  {
    path: '/workCircle/circleDetail',
    name: 'circleDetail',
    component: resolve => require(['@/views/workCircle/circleDetail'], resolve)
  }
]

export default routers
