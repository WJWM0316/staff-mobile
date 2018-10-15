let company = window.localStorage.getItem('XPLUSCompany') || 'tiger'
const settings = {
// 全局设置
  // host: process.env.NODE_ENV !== 'production' ? '/lighthouse_wap' : '/beaconserver', // 接口根地址。线上使用的是Nginx代理
  host: process.env.NODE_ENV !== 'production' ? `/xplus_wap` : `http://wap.xplus.ziwork.com`, // 接口根地址。线上使用的是Nginx代理
  dbPrefix: 'xplus_', // 本地存储的key
  serverUrl: process.env.NODE_ENV === 'production' ? `http://wap.xplus.ziwork.com/${company}` : '',
  productUrl: `http://wap.xplus.ziwork.com/${company}`,
  devUrl: `http://wap.xplus.ziwork.com/${company}`
}

export default settings
