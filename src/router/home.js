const routers = [
  {
    path: '/',
    redirect: to => {
      return '/home/index'
    }
  },
  {
    path: '/home/index',
    name: 'homeIndex',
    component: resolve => require(['@/views/home/index'], resolve)
  }
]

export default routers
