const routers = [
  {
    path: '/bookHouse',
    name: 'bookHouse',
    meta: {title: '书籍', pullDown: true},
    component: resolve => require(['@/views/bookHouse/index'], resolve)
  },
  {
    path: '/bookDetail',
    name: 'bookDetail',
    meta: {title: '书籍详情'},
    component: resolve => require(['@/views/bookHouse/detail'], resolve)
  },
  {
    path: '/reader',
    name: 'reader',
    meta: {title: '书籍阅读器'},
    component: resolve => require(['@/views/bookHouse/reader'], resolve)
  }
]

export default routers