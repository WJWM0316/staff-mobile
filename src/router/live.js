const routers = [
  {
    path: '/live',
    name: 'liveIndex',
    component: resolve => require(['@/views/live/index'], resolve)
  }
]

export default routers

