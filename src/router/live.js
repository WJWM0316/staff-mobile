const routers = [
  {
    path: '/live',
    name: 'live',
    meta: { title: '直播列表', pullDown: true },
    component: resolve => require(['@/views/live/index'], resolve)
  },
  {
    path: '/live/room',
    name: 'liveRoom',
    meta: { title: '直播间' },
    component: resolve => require(['@/views/live/liveRoom'], resolve)
  },
  {
    path: '/live/detail',
    name: 'liveDetail',
    meta: { title: '直播详情' },
    component: resolve => require(['@/views/live/liveDetail'], resolve)
  }
]

export default routers

