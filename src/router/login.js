const routers = [
  {
    path: 'login',
    name: 'login',
    component: resolve => require(['@/views/login/index'], resolve)
  }
]

export default routers
