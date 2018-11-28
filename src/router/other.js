const routers = [
  {
    path: '/404',
    name: 'other',
    meta: { title: '页面丢失' },
    component: resolve => require(['@/views/other/404'], resolve)
  },
  {
    path: '/plyr',
    name: 'plyr',
    meta: { title: '页面丢失' },
    component: resolve => require(['@/components/functional/plyrPlayer'], resolve)
  }
]

export default routers
