const routers = [
  {
    path: '/workCircle',
    name: 'workCircleIndex',
    meta: { title: '工作圈', needBottomTab: true },
    component: resolve => require(['@/views/workCircle/index'], resolve)
  },
  /* 工作圈详情页 */
  {
    path: '/workCircle/circleDetail',
    name: 'circleDetail',
    component: resolve => require(['@/views/workCircle/circleDetail'], resolve)
  },
  /* 工作圈发帖页  */
  {
    path: '/workCircle/circleEdit',
    name: 'circleEdit',
    component: resolve => require(['@/views/workCircle/circleEditting'], resolve)
  }
]

export default routers
