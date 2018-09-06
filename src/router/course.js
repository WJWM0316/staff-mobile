const routers = [
  {
    path: '/course',
    name: 'courseIndex',
    component: resolve => require(['@/views/course/index'], resolve)
  }
]

export default routers
