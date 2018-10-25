<template>
  <div class="m-recorder" :class="`z-${status}`">
    <div class="controls">
      <!-- 默认 -->
      <template v-if="status === 'default'">
        <button type="button" class="control btn" @click="handleStart">
          <div class="operBtn">
            <i class="icon iconfont icon-record"></i>
          </div>
          <span class="text">最多录制60秒，点击开始</span>
        </button>
      </template>
      <!-- 录制中 -->
      <template v-if="status === 'recording'">
        <button type="button" class="control btn" @click="handleFinish">
          <i class="icon icon-btn_stop"></i>
          <span class="text">完成</span>
        </button>
      </template>
      <!-- 暂停中 -->
      <!-- <template v-if="status === 'pause'">
        <button type="button" class="control btn" @click="handleResume">
          <i class="icon u-icon-btn-recorder-start"></i>
          <span class="text">继续</span>
        </button>
        <button type="button" class="finish btn right" @click="handleFinish">
          <i class="icon u-icon-btn-recorder-finish"></i>
          <span class="text">完成</span>
        </button>
      </template> -->
      <!-- 完成录制 -->
      <template v-if="status === 'finish'">
        <button type="button" class="restart btn left" @click="handleRestart">
          <i class="icon icon-remake"></i>
          <span class="text">重录</span>
        </button>
        <button type="button" class="control btn" @click="handlePlay">
          <i class="icon icon-record"></i>
          <span class="text">试听</span>
        </button>
        <button type="button" class="publish btn right" @click="handlePublish">
          <i class="icon icon-send"></i>
          <span class="text">{{publishBtnText}}</span>
        </button>
      </template>
      <!-- 试听中 -->
      <template v-if="status === 'listening'">
        <button type="button" class="restart btn left" @click="handleRestart">
          <i class="icon icon-remake"></i>
          <span class="text">重录</span>
        </button>
        <button type="button" class="control btn" @click="handleStop">
          <i class="icon icon-btn_pause"></i>
          <span class="text">停止</span>
        </button>
        <button type="button" class="publish btn right" @click="handlePublish">
          <i class="icon icon-send"></i>
          <span class="text">{{publishBtnText}}</span>
        </button>
      </template>
    </div>
  </div>
</template>
<script>
import WechatMixin from '@/mixins/wechat'
export default {
  mixins: [WechatMixin],
  props: {
    // 上传按钮文本
    publishBtnText: {
      type: String,
      default: '发布'
    },
    // 上传确认信息框
    publishConfirmContent: {
      type: String,
      default: '确定要发布？'
    }
  },
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
      try {
        this.$emit('uploading')
        const res = await this.wechatUploadVoice(this.localId)
        this.uploadWechatSuccess(res)
      } catch (error) {
        this.$vux.toast.text(error.message, 'bottom')
      }
    },
    /**
     * 文件成功上传到微信服务器
     */
    async uploadWechatSuccess ({ serverId }) {
      let data = {
        mediaId: serverId,
        type: 'audio'
      }
      const { files } = await this.wxUploadFile(data)
      this.$emit('upload-success', files)
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
      this.$vux.confirm.show({
        content: '确定要重录？',
        onConfirm () {
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
      this.$vux.confirm.show({
        content: this.publishConfirmContent,
        onConfirm () {
          // self.upload()
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
  }
}
</script>

<style lang="less" scoped>
.m-recorder {
  padding: 35px 0 20px;
  background: #fff;
  &.z-finish,
  &.z-listening {
    .duration {
      display: block;
    }
  }
  .duration {
    display: none;
    margin-bottom: 13px;
    text-align: center;
    line-height: 22px;
    font-size: 14px;
    color: #d7ab70;
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
      }

      &.left {
        left: 50px;
      }

      &.right {
        right: 50px;
      }

      &.control {
        .operBtn {
          width: 74px;
          height: 74px;
          margin: 0 auto;
          background-color: #FFE266;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 15px;
          .icon-record {
            font-size: 60px; /*px*/
            color: rgb(102, 102, 102);
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

