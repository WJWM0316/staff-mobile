const routers = [
  {
    path: '/workCircle',
    name: 'workCircle',
    meta: { title: '工作圈', needBottomTab: true },
    component: resolve => require(['@/views/workCircle/index'], resolve)
  }
]

export default routers
