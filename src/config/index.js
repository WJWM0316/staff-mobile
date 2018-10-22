const settings = {
// 全局设置
  dbPrefix: 'xplus_', // 本地存储的key
  productApi: 'http://wap-api.xplus.xiaodengta.com', // 生产环境api
  devApi: 'http://wap.xplus.ziwork.com', // 测试环境api
  devWsApi: 'ws://work-api.xplus.ziwork.com', // 测试环境webSocket
  productWsApi: 'ws://work-api.xplus.xiaodengta.com', // 生产环境webSocket
  host: process.env.NODE_ENV !== 'production' ? `/xplus_wap` : process.type !== 'production' ? this.devApi : this.productApi,
  websocketUrl: process.env.NODE_ENV !== 'production' ? this.devWsApi : process.type !== 'production' ? this.devWsApi : this.productWsApi
}
export default settings
