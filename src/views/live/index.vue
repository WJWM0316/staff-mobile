<template>
  <div class='wrap'>
    <div class='header'>
      <p class='title'>教你如何高效记单词</p>
      <p class='msg'><span class='status'>直播进行中</span><span class='num'>1人参与</span></p>
      <div class='more'>更多介绍</div>
    </div>
    <div class="main">
      <scroller class="scroll"
        :pulldown=true
        :listenScroll=true
        :list="list"
        @pullingDown="loadMore">
        <div class="btn" @click="closeWs()"></div>
        <p v-for="(n, index) in list" :key="index">{{n}}</p>
      </scroller>
    </div>
  </div>
</template>
<script>
import scroller from '@c/layout/scroller'
import localstorage from '@u/localstorage'
import ws from '@u/websocket'
export default {
  components: {
    scroller
  },
  data () {
    return {
      list: [
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111',
        '测试111'
      ]
    }
  },
  methods: {
    loadMore () {
      this.list = this.list.concat([
        '测试22222',
        '测试4444',
        '测试777',
        '测试122',
        '测试122',
        '测试42'
      ])
    },
    closeWs () {
      ws.close()
    }
  },
  mounted () {
    ws.create('ws://work-api.xplus.ziwork.com/tiger')
  }
}
</script>
<style lang='less' scoped>
  .wrap {
    width: 100%;
    height: 100vh;
    .header {
      height: 52px;
      width: 100%;
      box-shadow:0px 1px 0px 0px rgba(0,0,0,0.05);
      background: #fff;
      padding: 7px 0;
      box-sizing: border-box;
      text-align: center;
      position: relative;
      .title {
        font-size: 30px; /*px*/
        font-weight:400;
        color: #22292C;
        line-height: 20px;
      }
      .msg {
        font-size:24px; /*px*/
        font-weight: 400;
        line-height: 16px;
        color: #929292;
        .status {
          margin-right: 10px;
        }
      }
      .more {
        font-size: 24px; /*px*/
        font-weight: 300;
        color: #666666;
        line-height: 17px;
        position: absolute;
        top: 18px;
        right: 12px;
      }
    }
    .btn {
      width: 50px;
      height: 50px;
      background: #000;
    }
    .main {
      width: 100%;
      height: 100vh;
      padding: 52px 0;
      box-sizing: border-box;
      margin-top: -52px;
      .scroll {
        height: 100%;
      }
    }
  }
</style>