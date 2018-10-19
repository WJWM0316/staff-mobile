const settings = {
// 全局设置
  // host: process.env.NODE_ENV !== 'production' ? '/lighthouse_wap' : '/beaconserver', // 接口根地址。线上使用的是Nginx代理
  host: process.env.NODE_ENV !== 'production' ? `/xplus_wap` : `http://wap-api.xplus.xiaodengta.com`, // 接口根地址。线上使用的是Nginx代理
  dbPrefix: 'xplus_', // 本地存储的key
  productApi: 'http://wap-api.xplus.xiaodengta.com',
  devApi: 'http://wap.xplus.ziwork.com',
  devWsApi: 'ws://work-api.xplus.ziwork.com',
  productWsApi: 'ws://work-api.xplus.xiaodengta.com'
}
export default settings
