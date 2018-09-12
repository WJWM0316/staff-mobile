const __instance = (function () {
  let instance
  return (newInstance) => {
    if (newInstance) {
      instance = newInstance
    }

    return instance
  }
})()

class Flexible {
  metaEl = document.querySelector('meta[name="viewport"]') // viewport meta
  docEl = document.documentElement // html DOM
  docWidth = this.docEl.clientWidth // 防止横竖屏切换的计算问题
  baseRem = 75
  dpr = 1 // 设备dpr
  rem = 16 // 单位rem
  scale = 1 // 当前缩放值
  minSize = this.docWidth // 宽高最小值

  constructor () {
    if (__instance()) {
      return __instance()
    }

    this.init()

    __instance(this)
  }

  init () {
    if (!this.metaEl) {
      this.metaEl = document.createElement('meta')
      this.metaEl.setAttribute('name', 'viewport')
      this.metaEl.setAttribute('content', 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no')
      this.docEl.firstElementChild.appendChild(this.metaEl)
    }

    window.dpr = this.dpr = Math.floor(window.devicePixelRatio) || 1
    this.scale = 1 / this.dpr
    this.minSize = Math.min(this.docEl.clientWidth, this.docEl.clientHeight)

    if (!navigator.userAgent.match(/AppleWebKit.*Mobile.*/)) {
      this.minSize = 375 * this.dpr
    }

    this.setBodyFontSize()
    this.setRem()

    // 监听屏幕旋转或者尺寸变化
    const resizeEvt = 'onorientationchange' in window ? 'orientationchange' : 'resize'
    window.removeEventListener(resizeEvt, this.setRem.bind(this))
    window.addEventListener(resizeEvt, this.setRem.bind(this))

    // 0.5像素支持
    if (this.dpr >= 2) {
      // this.docEl.classList.add('hairlines')
      const fakeBody = document.createElement('body')
      const testElement = document.createElement('div')
      testElement.style.border = '.5px solid transparent'
      fakeBody.appendChild(testElement)
      this.docEl.appendChild(fakeBody)
      if (testElement.offsetHeight === 1) {
        this.docEl.classList.add('hairlines')
      }
      this.docEl.removeChild(fakeBody)
    }
  }

  /**
   * 设置body字体大小
   */
  setBodyFontSize () {
    if (document.body) {
      document.body.style.fontSize = (16 * this.dpr) + 'px'
    } else {
      document.removeEventListener('DOMContentLoaded', this.setBodyFontSize.bind(this))
      document.addEventListener('DOMContentLoaded', this.setBodyFontSize.bind(this))
    }
  }

  /**
   * 设置一个rem = 屏幕宽度 / 10
   */
  setRem () {
    const dpr = this.dpr
    const minSize = this.minSize
    const scale = this.scale
    this.rem = (minSize * dpr) / 10

    // 设置viewport，进行缩放，达到高清效果
    this.metaEl.setAttribute('content', 'width=' + (dpr * minSize) + ',initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no')

    // 设置data-dpr属性，留作的css hack之用
    this.docEl.setAttribute('data-dpr', dpr.toString())

    // 动态写入样式
    this.docEl.style.fontSize = this.rem + 'px'

    window.rem = this.rem
  }

  /**
   * rem转换车成px
   * @param value
   * @return {number}
   */
  rem2px (value) {
    value = parseFloat(value)
    return value * this.rem
  }

  /**
   * px转换成rem
   * @param value
   * @return {number}
   */
  px2rem (value) {
    value = parseFloat(value)
    return value / this.rem
  }
}

export default new Flexible()
