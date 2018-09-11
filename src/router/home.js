const routers = [
  {
    path: '/',
    redirect: to => {
      return '/home'
    }
  },
  {
    path: '/home',
    name: 'home',
    meta: { title: '首页', needBottomTab: true },
    component: resolve => require(['@/views/home/index'], resolve)
  }
]

export default routers
