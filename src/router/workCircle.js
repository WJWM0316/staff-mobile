const routers = [
  {
    path: '/workCircle',
    name: 'workCircle',
    meta: { title: '工作圈', needBottomTab: true },
    component: resolve => require(['@/views/workCircle/index'], resolve)
  },
  /* 工作圈详情页 */
  {
    path: '/circleDetail',
    name: 'circleDetail',
    component: resolve => require(['@/views/workCircle/circleDetail'], resolve)
  },
  /* 工作圈发帖页  */
  {
    path: '/circleEdit',
    name: 'circleEdit',
    component: resolve => require(['@/views/workCircle/circleEditting'], resolve)
  },
  /* 设置  */
  {
    path: '/setting',
    name: 'setting',
    component: resolve => require(['@/views/workCircle/setting'], resolve)
  },
  /* 帖子详情  */
  {
    path: '/postDetail',
    name: 'postDetail',
    component: resolve => require(['@/views/workCircle/detail'], resolve)
  },
  /* 成员列表 */
  {
    path: '/circleMemberList',
    name: 'circleMemberList',
    meta: { title: '成员列表' },
    component: resolve => require(['@/views/workCircle/memberList'], resolve)
  }
]

export default routers
