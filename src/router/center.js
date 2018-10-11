const routers = [
  {
    path: '/center',
    name: 'center',
    meta: { title: '我的', needBottomTab: true },
    component: resolve => require(['@/views/center/index'], resolve)
  },
  {
    path: '/infoEdit',
    name: 'edit',
    meta: { title: '资料编辑' },
    component: resolve => require(['@/views/center/edit'], resolve)
  },
  {
    path: '/personalPage',
    name: 'personalPage',
    meta: { title: '个人主页' },
    component: resolve => require(['@/views/center/personalPage'], resolve)
  },
  {
    path: '/settings',
    name: 'settings',
    meta: { title: '账号管理' },
    component: resolve => require(['@/views/center/settings'], resolve)
  },
  {
    path: '/resetPassword',
    name: 'resetPassword',
    meta: { title: '修改密码' },
    component: resolve => require(['@/views/center/resetPassword'], resolve)
  }
]

export default routers
