const routers = [
  {
    path: '/center',
    name: 'center',
    meta: { title: '我的', needBottomTab: true },
    component: resolve => require(['@/views/center/index'], resolve)
  },
  {
    path: '/center/edit',
    name: 'edit',
    meta: { title: '资料编辑' },
    component: resolve => require(['@/views/center/edit'], resolve)
  }
]

export default routers
