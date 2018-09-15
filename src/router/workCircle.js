const routers = [
  {
    path: '/workCircle/index',
    name: 'workCircle',
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
  },
  /* 设置  */
  {
    path: '/workCircle/setting',
    name: 'setting',
    component: resolve => require(['@/views/workCircle/setting'], resolve)
  }
]

export default routers
