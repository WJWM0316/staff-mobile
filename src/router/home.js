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
    meta: { title: 'XPLUS', needBottomTab: true, pullDown: true },
    component: resolve => require(['@/views/home/index'], resolve)
  }
]

export default routers
