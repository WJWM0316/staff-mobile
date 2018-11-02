const routers = [
  {
    path: '/404',
    name: 'lostPage',
    meta: { title: '页面丢失' },
    component: resolve => require(['@/views/other/404'], resolve)
  }
]

export default routers
