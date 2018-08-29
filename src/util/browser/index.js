/**
 * 浏览器信息
 */
class Browser {
  _navigator = navigator
  _userAgent = this._navigator.userAgent
  _language = (this._navigator.browserLanguage || this._navigator.language).toLowerCase()
  // appVersion = this.navigator.appVersion
  _version = this.getVersion()

  /**
   * 移动终端浏览器版本信息
   * @return {Object}
   */
  getVersion () {
    return {
      trident: this._userAgent.indexOf('Trident') > -1, // IE内核
      presto: this._userAgent.indexOf('Presto') > -1, // opera内核
      webKit: this._userAgent.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
      gecko: this._userAgent.indexOf('Gecko') > -1 && this._userAgent.indexOf('KHTML') === -1, // 火狐内核
      mobile: !!this._userAgent.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
      ios: !!this._userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
      android: this._userAgent.indexOf('Android') > -1 || this._userAgent.indexOf('Linux') > -1, // android终端或者uc浏览器
      iPhone: this._userAgent.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
      iPad: this._userAgent.indexOf('iPad') > -1, // 是否iPad
      wechat: this._userAgent.indexOf('MicroMessenger') > -1, // 是否微信
      webApp: this._userAgent.indexOf('Safari') === -1 // 是否web应用程序，没有头部与底部
    }
  }

  /**
   * 是否是移动端
   * @return {boolean|*}
   */
  isMobile () {
    return this._version.mobile
  }

  /**
   * 判断是否是ios端
   * @return {boolean|*}
   */
  isIos () {
    return this._version.ios
  }

  /**
   * 判断是否是android端
   * @return {boolean|*}
   */
  isAndroid () {
    return this._version.android
  }

  /**
   * 判断是否是微信端
   * @return {boolean|*}
   */
  isWechat () {
    return this._version.wechat
  }

  /**
   * 语言版本
   * @return {string}
   */
  getLanguage () {
    return this._language
  }
}

export default new Browser()
