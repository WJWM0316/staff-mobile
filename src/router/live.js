const routers = [
  {
    path: '/live',
    name: 'live',
    component: resolve => require(['@/views/live/index'], resolve)
  }
]

export default routers

