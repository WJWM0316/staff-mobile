const routers = [
  {
    path: '/center',
    name: 'personalCenter',
    component: resolve => require(['@/views/center/index'], resolve)
  }
]

export default routers
