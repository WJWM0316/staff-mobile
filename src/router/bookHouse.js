const routers = [
  {
    path: '/bookHouse',
    name: 'bookHouse',
    component: resolve => require(['@/views/bookHouse/index'], resolve)
  }
]

export default routers