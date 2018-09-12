const routers = [
  {
    path: '/center',
    name: 'center',
    meta: { title: '我的', needBottomTab: true },
    component: resolve => require(['@/views/center/index'], resolve)
  }
]

export default routers
