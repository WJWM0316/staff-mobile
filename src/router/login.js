const routers = [
  {
    path: '/login',
    name: 'login',
    meta: { title: '首页' },
    component: resolve => require(['@/views/login/index'], resolve)
  }
]

export default routers
