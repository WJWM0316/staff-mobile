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
    meta: { title: '工作圈详情', pullDown: true },
    component: resolve => require(['@/views/workCircle/circleDetail'], resolve)
  },
  /* 工作圈发帖页  */
  {
    path: '/circleEdit',
    name: 'circleEdit',
    meta: { title: '编辑' },
    component: resolve => require(['@/views/workCircle/circleEditting'], resolve)
  },
  /* 设置  */
  {
    path: '/setting',
    name: 'setting',
    meta: { title: '设置' },
    component: resolve => require(['@/views/workCircle/setting'], resolve)
  },
  /* 帖子详情  */
  {
    path: '/postDetail',
    name: 'postDetail',
    meta: { title: '帖子详情' },
    component: resolve => require(['@/views/workCircle/detail'], resolve)
  },
  /* 成员列表 */
  {
    path: '/circleMemberList',
    name: 'circleMemberList',
    meta: { title: '成员列表' },
    component: resolve => require(['@/views/workCircle/memberList'], resolve)
  },
  /* 成员列表 */
  {
    path: '/album',
    name: 'album',
    meta: { title: '相册' },
    component: resolve => require(['@/views/workCircle/album'], resolve)
  }
]

export default routers
