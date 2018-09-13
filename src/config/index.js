const address = location.href.split('/')[3]
const settings = {
// 全局设置
  // host: process.env.NODE_ENV !== 'production' ? '/lighthouse_wap' : '/beaconserver', // 接口根地址。线上使用的是Nginx代理
  host: process.env.NODE_ENV !== 'production' ? `xplus_wap` : `/${address}`, // 接口根地址。线上使用的是Nginx代理
  dbPrefix: 'xplus_wap', // 本地存储的key
  serverUrl: process.env.NODE_ENV !== 'production' ? `http://wap.xplus.ziwork.com/tiger` : 'http://wap.xplus.ziwork.com/tiger',
  productUrl: 'https://www.zike.com/beaconserver',
  devUrl: 'http://wap.xplus.ziwork.com/tiger'
}

export default settings
