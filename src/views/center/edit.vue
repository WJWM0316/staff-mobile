<template>
  <div class="edit">
    <div class="item border-bottom-1px">
      <span class="txt">头像</span>
      <span class="editBox">
        <i class="photo"><img :src="pageInfo.avatarInfo.middleUrl" alt=""></i>
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
        <popup-picker
          placeholder="请选择性别"
          v-model="sex"
          :data="sexList"
          show-name
        ></popup-picker>
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
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { PopupPicker } from 'vux'
export default {
  components: {
    PopupPicker
  },
  data () {
    return {
      pageInfo: null,
      sex: [],
      sexList: [[
        {
          name: '男',
          value: 0
        },
        {
          name: '女',
          value: 1
        }
      ]]
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.global.userInfo
    })
  },
  methods: {
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
}
</style>