const routers = [
  {
    path: '/bookHouse',
    name: 'bookHouseIndex',
    component: resolve => require(['@/views/bookHouse/index'], resolve)
  }
]

export default routers