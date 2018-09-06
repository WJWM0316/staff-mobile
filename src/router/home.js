const routers = [
  {
    path: '/',
    redirect: to => {
      return '/home/index'
    }
  },
  {
    path: '/home',
    name: 'homeIndex',
    meta: { title: '首页', bottomTab: true },
    component: resolve => require(['@/views/home/index'], resolve)
  }
]

export default routers
