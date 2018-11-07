// 微信jssdk mixin
import { getWechatSignApi, wxUploadFileApi } from '@/api/common'
import browser from '@/util/browser'
import Vue from 'vue'
export default {
  data () {
    return {
      wechatConfig: {
        debug: false,
        jsApiList: [
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'startRecord',
          'stopRecord',
          'onVoiceRecordEnd',
          'playVoice',
          'pauseVoice',
          'stopVoice',
          'onVoicePlayEnd',
          'uploadVoice',
          'downloadVoice',
          'chooseImage',
          'previewImage',
          'uploadImage',
          'downloadImage',
          'chooseWXPay',
          'getLocalImgData'
        ]
      }
    }
  },
  methods: {
    /**
     * 获取微信签名
     */
    async getWechatSign () {
      if (this.$store.getters.wxConfig) return
      this.$store.dispatch('updata_wxConfig', this.wechatConfig)
      try {
        const params = {
          url: location.href.split('#')[0],
          jsApiList: this.wechatConfig.jsApiList
        }
        const res = await getWechatSignApi(params)
        this.wechatConfig = Object.assign({}, res.data)
        this.setWechatConfig()
      } catch (error) {
        this.$vux.toast.text(error.message, 'bottom')
      }
    },
    /**
     * 配置微信sdk
     */
    setWechatConfig () {
      // alert(JSON.stringify(this.wechatConfig))
      Vue.wx.config(this.wechatConfig)
    },

    /**
     * 选择图片
     * @param {*} options
     */
    wechatChooseImage (options = {}) {
      return new Promise((resolve, reject) => {
        Vue.wx.chooseImage({
          count: options.count || 9, // 默认9
          sizeType: options.sizeType || ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: options.sourceType || ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: async function (res) {
            resolve(res.localIds)
          },
          fail: function (e) {
            reject(e)
          }
        })
      })
    },

    /**
     * 获取本地base64数据
     * @param {*} localId
     */
    wechatGetLocalImgData (localId) {
      return new Promise((resolve, reject) => {
        if (browser.isIos() && Vue.wx.getLocalImgData) {
          Vue.wx.getLocalImgData({
            localId: localId, // 图片的localID
            success: function (res) {
              resolve(res)
            },
            fail: function (e) {
              reject(e)
            }
          })
        } else {
          resolve({ localData: '' })
        }
      })
    },

    /**
     * 预览图片
     * @param {*} options
     */
    wechatPreviewImage (options = {}) {
      return new Promise((resolve, reject) => {
        Vue.wx.previewImage({
          current: options.img,
          urls: options.urls
        })
      })
    },

    /**
     * 微信上传图片
     * @param {*} localId 需要上传的图片的本地ID，由chooseImage接口获得
     * @param {*} options
     */
    wechatUploadImage (localId, options = {}) {
      return new Promise((resolve, reject) => {
        Vue.wx.uploadImage({
          localId: localId,
          isShowProgressTips: options.isShowProgressTips || 0, // sdk默认为1，显示进度提示
          success: function (res) {
            resolve(res)
          },
          fail: function (e) {
            reject(e)
          }
        })
      })
    },

    /**
     * 微信上传语音
     * @param {*} localId
     * @param {*} options
     */
    wechatUploadVoice (localId, options = {}) {
      return new Promise((resolve, reject) => {
        Vue.wx.uploadVoice({
          localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
          isShowProgressTips: options.isShowProgressTips || 1, // 默认为1，显示进度提示
          success: function (res) {
            // const serverId = res.serverId // 返回音频的服务器端ID
            resolve(res)
          },
          fail: function (e) {
            reject(e)
          }
        })
      })
    },

    /**
     * 获取一个微信的录音对象
     * @return {Object}
     */
    getWechatRecorder () {
      const self = this
      let _localId = ''
      console.log('测试能不能进来')
      return {
        /**
         * 触发回调
         * @param {*} callback
         */
        triggerCallback (callback, ...options) {
          if (this[callback] && this[callback] instanceof Function) {
            this[callback](...options)
          }
        },

        /**
         * 开始录音
         * @return {Promise}
         */
        startRecord () {
          console.log('开始录音startRecord')
          Vue.wx.startRecord({
            success: (res) => {
              this.triggerCallback('onStartRecord', res)
              console.log('开始录音')
              Vue.wx.onVoiceRecordEnd({
                // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                complete: res => {
                  _localId = res.localId
                  this.triggerCallback('onRecordEnded', res)
                }
              })
            }
          })
        },

        /**
         * 停止录音
         * @return {Promise}
         */
        stopRecord ({ callStopRecord = true } = {}) {
          Vue.wx.stopRecord({
            success: res => {
              if (callStopRecord) {
                _localId = res.localId
                this.triggerCallback('onStopRecord', res)
              }
            }
          })
        },

        /**
         * 微信播放录音
         * @param {*} localId
         */
        playVoice ({localId} = {}) {
          localId = localId || _localId
          if (!localId) {
            console.log('没有找到localId')
            return
          }
          Vue.wx.playVoice({
            localId: localId, // 需要播放的音频的本地ID，由stopRecord接口获得
            success: () => {
              this.triggerCallback('onPlayVoice')
            }
          })
          Vue.wx.onVoicePlayEnd({
            success: res => {
              // var localId = res.localId // 返回音频的本地ID
              this.triggerCallback('onPlayVoiceEnded', res)
            }
          })
        },

        /**
         * 微信暂停录音
         * @param {*} localId
         */
        pauseVoice ({localId} = {}) {
          localId = localId || _localId
          if (!localId) {
            console.log('没有找到localId')
            return
          }
          Vue.wx.pauseVoice({
            localId: localId, // 需要暂停的音频的本地ID，由stopRecord接口获得
            success: () => {
              this.triggerCallback('onPauseVoice')
            }
          })
        },

        /**
         * 微信停止录音
         * @param {*} localId
         * @param {*} callStopVoice 是否调用回调函数
         */
        stopVoice ({localId, callStopVoice = true} = {}) {
          localId = localId || _localId
          if (!localId) {
            console.log('没有找到localId')
            return
          }
          Vue.wx.stopVoice({
            localId: localId, // 需要停止的音频的本地ID，由stopRecord接口获得
            success: () => {
              if (callStopVoice) {
                this.triggerCallback('onStopVoice')
              }
            }
          })
        }
      }
    },

    /**
     * 微信上传转存
     * @return {Object}
     */
    wxUploadFile ({mediaId, type, duration}) {
      return new Promise((resolve, reject) => {
        let data = {
          attach_id: mediaId,
          attach_type: type,
          duration: duration || 0
        }
        wxUploadFileApi(data).then(res => {
          resolve(res)
        })
      })
    },
    /**
     * 微信分享
     */
    async wechatShare (enter) {
      const wx = Vue.wx
      // 声明你想调用的接口
      // 发起 http 请求，获取公众号配置
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
  },
  created () {
    this.getWechatSign()
    Vue.wx.ready(() => {
    })
    Vue.wx.checkJsApi({
      jsApiList: this.wechatConfig.jsApiList, // 需要检测的JS接口列表，所有JS接口列表见附录2,
      success: function (res) {
        console.log('客户端允许', res)
        // 以键值对的形式返回，可用的api值true，不可用为false
        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
      }
    })
  }
}
