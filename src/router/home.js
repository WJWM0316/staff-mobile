const routers = [
  {
    path: '*',
    redirect: to => {
      return '/home'
    }
  },
  {
    path: '/home',
    name: 'home',
    meta: { title: 'XPLUS', needBottomTab: true, pullDown: true, keepAlive: true },
    component: resolve => require(['@/views/home/index'], resolve)
  },
  {
    path: '/homeTc',
    name: 'homeTc',
    meta: { title: 'XPLUS', pullDown: true, keepAlive: true },
    component: resolve => require(['@/views/home/indexTc'], resolve)
  }
]

export default routers
