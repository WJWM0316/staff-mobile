<template>
  <div class="m-recorder" :class="`z-${status}`">
    <div class="controls">
      <button type="button" v-show="status === 'finish'" class="restart btn left" @click="handleRestart">
        <i class="icon iconfont icon-remake"></i>
        <span class="text">重录</span>
      </button>
      <button type="button" class="control btn" @click.stop="touchstartFun()">
        <p class="duration" v-show="status === 'recording' || status === 'listening'">{{duration}}s</p>
        <div class="btnShadow">
          <div class="operBtn" :class="{'playing': status === 'recording' || status === 'listening'}">
            <i class="icon iconfont" :class="btnClass"></i>
          </div>
        </div>
        <span class="text" v-show="status === 'default'">最多录制60秒，点击开始</span>
        <span class="text" v-show="status === 'recording'">录制中</span>
        <span class="text" v-show="status === 'finish'">点击试听</span>
        <span class="text" v-show="status === 'listening'">停止</span>
      </button>
      <button type="button" v-show="status === 'finish'" class="publish btn right" @click="handlePublish">
        <i class="icon iconfont icon-send"></i>
        <span class="text">发送</span>
      </button>
    </div>
  </div>
</template>
<script>
import WechatMixin from '@/mixins/wechat'
export default {
  mixins: [WechatMixin],
  data () {
    return {
      manager: null, // 录音管理器
      duration: 0, // 录音总长度
      progress: 0, // 录音进度||播放进度
      status: 'default',
      localId: '', // 录音文件localId
      recorderInterval: null
    }
  },
  computed: {
    btnClass () {
      if (this.status === 'default' || this.status === 'finish') {
        return 'icon-record'
      } else if (this.status === 'recording') {
        return 'icon-btn_stop'
      } else {
        return 'icon-btn_pause'
      }
    }
  },
  methods: {
    init () {
      this.manager.onStartRecord = () => {
        this.status = 'recording'
        this.startInterval()
        this.$emit('recording')
      }
      this.manager.onStopRecord = res => {
        this.localId = res.localId
        this.status = 'finish'
        this.duration = this.progress
        this.progress = 0
        this.stopInterval()
        this.$emit('finish', res)
      }
      this.manager.onRecordEnded = res => {
        this.localId = res.localId
        this.status = 'finish'
        this.duration = 60000
        this.progress = 0
        this.stopInterval()
        this.$toast({
          text: '已达到此音频的最大长度限制。',
          type: 'warn'
        })
        this.$emit('finish', res)
      }

      this.manager.onPlayVoice = () => {
        this.status = 'listening'
        this.progress = 0
        this.startInterval()
        this.$emit('listen-play')
      }

      this.manager.onStopVoice = () => {
        this.status = 'finish'
        this.progress = 0
        this.stopInterval()
        this.$emit('listen-stop')
      }

      this.manager.onPlayVoiceEnded = () => {
        this.status = 'finish'
        this.progress = 0
        this.stopInterval()
        this.$emit('listen-ended')
      }
    },
    /**
     * 开始计时
     */
    startInterval () {
      this.stopInterval()
      this.recorderInterval = setInterval(() => {
        this.progress += 100
        if (this.duration > 0 && this.progress > this.duration) {
          this.progress = this.duration
        }
      }, 100)
    },
    /**
     * 停止计时
     */
    stopInterval () {
      if (this.recorderInterval) {
        clearInterval(this.recorderInterval)
      }
    },
    /**
     * 上传文件到微信服务器
     */
    async upload () {
      this.$emit('uploading')
      const res = await this.wechatUploadVoice(this.localId)
      console.log(res, 12121)
      this.uploadWechatSuccess(res)
    },
    /**
     * 文件成功上传到微信服务器
     */
    async uploadWechatSuccess ({ serverId }) {
      let data = {
        mediaId: serverId,
        type: 'audio'
      }
      const res = await this.wxUploadFile(data)
      this.clear()
      this.$emit('upload-success', res.data)
    },
    /**
     * 清除
     */
    clear () {
      this.manager && this.manager.stopRecord({ callStopRecord: false })
      this.manager && this.manager.stopVoice({ callStopVoice: false })
      this.localId = ''
      this.status = 'default'
      this.duration = 0
      this.progress = 0
      this.stopInterval()
    },
    touchstartFun () {
      if (this.status === 'default') {
        this.handleStart()
      } else if (this.status === 'finish') {
        this.handlePlay()
      } else {
        this.handleStop()
      }
    },
    /**
     * 开始录音
     */
    handleStart () {
      this.manager && this.manager.startRecord()
    },
    /**
     * 完成录音
     */
    handleFinish () {
      this.manager && this.manager.stopRecord()
    },
    /**
     * 重新录制
     */
    handleRestart () {
      const self = this
      this.$confirm({
        title: '重新开始录音',
        content: '重新录音，原有录音将会丢失',
        confirmBack: () => {
          self.progress = 0
          self.status = 'default'
          self.clear()
        }
      })
    },
    /**
     * 试听播放
     */
    handlePlay () {
      this.manager && this.manager.playVoice()
    },
    /**
     * 停止播放
     */
    handleStop () {
      this.manager && this.manager.stopVoice()
    },
    /**
     * 发布
     */
    handlePublish () {
      const self = this
      this.$confirm({
        title: '发布语音',
        content: '确定要该发布语音',
        confirmBack: () => {
          this.upload()
        }
      })
    },
    /**
     * 尝试停止播放录音（组件外调用）
     */
    stopPlayVoice () {
      if (this.status === 'playing') {
        this.handleStop()
      }
    }
  },
  mounted () {
    this.manager = this.getWechatRecorder()
    this.init()
  }
}
</script>

<style lang="less">
.m-recorder {
  padding: 18px 0 10px;
  background: #fff;
  -webkit-user-select:none;
  -webkit-user-drag:none;
  &.z-finish,
  &.z-listening {
    .duration {
      display: block;
    }
  }
  .duration {
    text-align: center;
    line-height: 30px; /*px*/
    font-size: 30px; /*px*/
    color: #354048;
  }
  .controls {
    position: relative;
    text-align: center;
    .btn {
      background: none;
      line-height: 1;
      border: none;
      font-size: 0;

      &:focus {
        outline: none;
      }
      .text {
        display: block;
        line-height: 16px;
        font-size: 12px;
        color: #d7ab70;
      }

      &.left,
      &.right {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        .icon {
          font-size: 70px; /*px*/
          line-height: 70px; /*px*/
          color: #666666;
        }
        .text {
          margin-top: 9px;
          color: #666666;
        }
      }

      &.left {
        left: 50px;
      }

      &.right {
        right: 50px;
      }

      &.control {
        .btnShadow {
          padding: 22px 16px 16px;
          overflow: hidden;
          overflow: hidden;
          .operBtn {
            width: 74px;
            height: 74px;
            margin: 0 auto;
            background-color: #FFE266;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            .icon {
              font-size: 60px; /*px*/
              color: rgb(102, 102, 102);
            }
            &.playing {
              animation: twinkle 2s linear infinite;
            }
          }
        }
        .text {
          color: #666;
        }
      }
    }

  }
}
</style>

