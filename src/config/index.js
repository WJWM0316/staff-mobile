const settings = {
// 全局设置
  dbPrefix: 'xplus_', // 本地存储的key
  productApi: 'http://wap-api.xplus.xiaodengta.com', // 生产环境api
  oauthUrl: process.env.NODE_ENV !== 'production' ? `http://admin-api.xplus.ziwork.com` : process.type !== 'production' ? `http://admin-api.xplus.ziwork.com` : 'http://admin-api.xplus.xiaodengta.com', // 授权链接
  devApi: 'http://wap.xplus.ziwork.com', // 测试环境api
  devWsApi: 'ws://work-api.xplus.ziwork.com', // 测试环境webSocket
  productWsApi: 'ws://work-api.xplus.xiaodengta.com', // 生产环境webSocket
  host: process.env.NODE_ENV !== 'production' ? `/xplus_wap` : process.type !== 'production' ? 'http://wap.xplus.ziwork.com' : 'http://wap-api.xplus.xiaodengta.com',
  websocketUrl: process.env.NODE_ENV !== 'production' ? 'ws://work-api.xplus.ziwork.com' : process.type !== 'production' ? 'ws://work-api.xplus.ziwork.com' : 'ws://work-api.xplus.xiaodengta.com'
}
export default settings
