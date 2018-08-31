const routers = [
  {
    path: '/live/index',
    name: 'liveIndex',
    component: resolve => require(['@/views/live/index'], resolve)
  }
]

export default routers

