const routers = [
  {
    path: '/workCircle/index',
    name: 'workCircleIndex',
    component: resolve => require(['@/views/workCircle/index'], resolve)
  },
  {
    path: '/workCircle/circleDetail',
    name: 'circleDetail',
    component: resolve => require(['@/views/workCircle/circleDetail'], resolve)
  }
]

export default routers
