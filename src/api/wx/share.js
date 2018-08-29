import { weixinApi } from './wxapi.js'

export const share = async (wx, http, enter) => {
  // 声明你想调用的接口
  let jsApiList = {
    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'onMenuShareWeibo', ''],
    debug: false
  }
  // 发起 http 请求，获取公众号配置
  let data = {url: window.document.location.href}
  const res = await weixinApi(data)
  let config = Object.assign(res, jsApiList)
  wx.config(config)
  wx.ready(() => {
    // 分享到朋友圈
    wx.onMenuShareTimeline({
      title: enter.title, // 分享标题
      link: enter.link,
      imgUrl: enter.imgUrl
    })
    // 分享到QQ空间
    wx.onMenuShareQZone({
      title: enter.title, // 分享标题
      desc: enter.desc,
      link: enter.link,
      imgUrl: enter.imgUrl
    })
    // 分享到好友
    wx.onMenuShareAppMessage({
      title: enter.titles ? enter.titles : enter.title, // 分享标题
      desc: enter.desc,
      link: enter.link,
      imgUrl: enter.imgUrl
    })
    // 分享到QQ
    wx.onMenuShareQQ({
      title: enter.titles ? enter.titles : enter.title, // 分享标题
      desc: enter.desc,
      link: enter.link,
      imgUrl: enter.imgUrl
    })
    // 分享到腾讯微博
    wx.onMenuShareWeibo({
      title: enter.title, // 分享标题
      desc: enter.desc,
      link: enter.link,
      imgUrl: enter.imgUrl
    })
  })
}
