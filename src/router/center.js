const routers = [
  {
    path: '/center/index',
    name: 'personalCenter',
    component: resolve => require(['@/views/center/index'], resolve)
  }
]

export default routers
