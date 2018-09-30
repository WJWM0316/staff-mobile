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
  }
]

export default routers
