<template>
  <div class="edit">
    <div class="item border-bottom-1px">
      <span class="txt">头像</span>
      <span class="editBox">
        <i class="photo" @click.stop="editPhoto" v-if="pageInfo.avatarInfo"><img :src="pageInfo.avatarInfo.middleUrl" alt=""></i>
      </span>
    </div>
    <div class="item border-bottom-1px">
      <span class="txt must">姓名</span>
      <span class="editBox">
        <input type="text" placeholder="请输入姓名">
      </span>
    </div>
    <div class="item border-bottom-1px">
      <span class="txt must">性别</span>
      <span class="editBox">
        <span class="placeholder" v-if="!sexItem"  @click.stop="sexShow = true">请选择性别</span>
        <span class="operResult" v-else  @click.stop="sexShow = true">{{sexItem}}</span>
        <actionSheet
          :showSheet="sexShow"
          :menus="sexList"
          @choseResult="_choseResult"
        ></actionSheet>
      </span>
    </div>
    <div class="item border-bottom-1px">
      <span class="txt must">岗位</span>
      <span class="editBox">
        <input type="text" placeholder="请输入岗位">
      </span>
    </div>
    <div class="item border-bottom-1px">
      <span class="txt must">邮箱</span>
      <span class="editBox">
        <input type="text" placeholder="请输入邮箱">
      </span>
    </div>
    <div class="item border-bottom-1px">
      <span class="txt">手机号</span>
      <span class="editBox">
        <input type="text" placeholder="请输入手机号">
      </span>
    </div>
    <div class="item border-bottom-1px">
      <span class="txt">微信</span>
      <span class="editBox">
        <input type="text" placeholder="请输入微信">
      </span>
    </div>
    <xButton class="saveBtn">保存</xButton>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  components: {
  },
  data () {
    return {
      pageInfo: null,
      sexShow: false,
      sexKey: null,
      sexItem: null,
      sexList: {
        0: '男',
        1: '女'
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.global.userInfo
    })
  },
  methods: {
    _choseResult (sexKey, sexItem) {
      this.sexKey = sexKey
      this.sexItem = sexItem
      this.sexShow = false
    },
    editPhoto () {
      console.log(111111)
      this.wechatChooseImage()
    }
  },
  watch: {
  },
  async created () {
    this.pageInfo = this.userInfo
  }
}
</script>
<style lang="less">
.edit {
  padding: 0 20px;
  .item {
    padding: 20px 0;
    display: flex;
    .txt {
      flex: 1;
      display: flex;
      align-items: center;
      padding-left: 17px;
      position: relative;
      &.must::after {
        content: '*';
        font-size: 30px; /*px*/
        color: #D7AB70;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
      }
    }
    .editBox {
      flex: 2;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .photo {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
      input {
        width: 100%;
        border: none;
        text-align: right;
        font-weight: 400;
        color: #354048;
        font-size: 30px; /*px*/
      }
      .operResult {
        font-weight: 400;
        color: #354048;
        font-size: 30px; /*px*/
      }
      .placeholder {
        color: #BCBCBC;
        font-size: 30px; /*px*/
      }
      ::-webkit-input-placeholder {
        color: #BCBCBC;
      }
      .vux-cell-box {
        width: 100%;
      }
      .vux-cell-placeholder {
        font-size: 30px; /*px*/
        color: #BCBCBC;
      }
    }
  }
  .saveBtn {
    margin-top: 40px;
    border-radius: 22px;
    height: 44px;
    line-height: 44px;
    font-size: 32px; /*px*/
  }
}
</style>