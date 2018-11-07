const routers = [
  {
    path: '/live',
    name: 'live',
    meta: { title: '直播列表', pullDown: true },
    component: resolve => require(['@/views/live/index'], resolve)
  },
  {
    path: '/liveRoom',
    name: 'liveRoom',
    meta: { title: '直播间', reload: true },
    component: resolve => require(['@/views/live/liveRoom'], resolve)
  },
  {
    path: '/liveDetail',
    name: 'liveDetail',
    meta: { title: '直播详情' },
    component: resolve => require(['@/views/live/liveDetail'], resolve)
  },
  {
    path: '/liveMemberList',
    name: 'liveMemberList',
    meta: { title: '成员列表', pullDown: true },
    component: resolve => require(['@/views/live/memberList'], resolve)
  }
]

export default routers

