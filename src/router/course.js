const routers = [
  {
    path: '/course/index',
    name: 'courseIndex',
    component: resolve => require(['@/views/course/index'], resolve)
  }
]

export default routers
