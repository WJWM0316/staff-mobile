<template>
  <div class="edit" v-if="pageInfo">
    <div class="item border-bottom-1px">
      <span class="txt">头像</span>
      <span class="editBox">
        <upLoadFile class="photo defaultImg"
          :imgUrl="pageInfo.avatar.smallUrl"
          attach_type="img"
          @upLoadResult="upLoadResult"
        ></upLoadFile>
      </span>
    </div>
    <div class="item border-bottom-1px">
      <span class="txt">姓名</span>
      <span class="editBox">
        {{pageInfo.realname}}
        <!-- <input type="text" placeholder="请输入姓名" v-model="pageInfo.realname" disabled> -->
      </span>
    </div>
    <div class="item border-bottom-1px">
      <span class="txt">性别</span>
      <span class="editBox">
        <!-- 暂时不做编辑， 需要开启即可 -->
        <!-- <span class="placeholder" v-if="pageInfo.gender !== 0 && pageInfo.gender !== 1"  @click.stop="sexShow = true">请选择性别</span> -->
        <span class="operResult" @click.stop="sexShow = true">{{pageInfo.gender === 0 ? '女' : '男'}}</span>
        <actionSheet
          v-if="false"
          :showSheet="sexShow"
          :menus="sexList"
          @choseResult="_choseResult"
        ></actionSheet>
      </span>
    </div>
    <div class="item border-bottom-1px">
      <span class="txt">岗位</span>
      <span class="editBox">
        {{pageInfo.occupation}}
        <!-- <input type="text" placeholder="请输入岗位" v-model="pageInfo.occupation" disabled> -->
      </span>
    </div>
    <div class="item border-bottom-1px">
      <span class="txt">邮箱</span>
      <span class="editBox">
        {{pageInfo.email}}
        <!-- <input type="text" placeholder="请输入邮箱" v-model="pageInfo.email" disabled> -->
      </span>
    </div>
    <div class="item border-bottom-1px">
      <span class="txt">手机号</span>
      <span class="editBox">
        <input type="text" placeholder="请输入手机号" v-model="pageInfo.mobile">
      </span>
    </div>
    <div class="item border-bottom-1px">
      <span class="txt">微信</span>
      <span class="editBox">
        <input type="text" placeholder="请输入微信" v-model="pageInfo.wechat">
      </span>
    </div>
    <xButton class="saveBtn" @click.stop.native="saveInfo">保存</xButton>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import upLoadFile from '@c/functional/upLoadFile'
import { PHONE, WECHAT } from '@u/regular/regular'
import { userInfoApi, editUserInfoApi } from '@/api/pages/center'
export default {
  components: {
    upLoadFile
  },
  data () {
    return {
      pageInfo: {
        avatar: {
          middleUrl: ''
        }
      },
      sexShow: false,
      sexItem: null,
      avatarId: null, // 头像id
      sexList: {
        1: '男',
        0: '女'
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
      this.pageInfo.gender = parseInt(sexKey)
      this.sexShow = false
    },
    async getUserInfo () {
      if (!this.userInfo) {
        let res = await userInfoApi()
        this.pageInfo = res.data.base
      } else {
        this.pageInfo = this.userInfo.base
      }
    },
    upLoadResult (result) {
      this.avatarId = result[0].id
      console.log(result, this.avatarId)
    },
    saveInfo () {
      let data = {
        avatarId: this.avatarId || this.pageInfo.avatar.id,
        mobile: this.pageInfo.mobile,
        wechat: this.pageInfo.wechat
      }
      let text = ''
      if (!PHONE.test(data.mobile)) {
        text = '手机号格式不正确'
      }
      if (!WECHAT.test(data.wechat)) {
        text = '微信号格式不正确'
      }
      if (text !== '') {
        this.$toast({
          text: text,
          type: 'text',
          width: '10em'
        })
        return
      }
      editUserInfoApi(data).then(res => {
        userInfoApi().then(res0 => {
          this.$store.dispatch('updata_userInfo', res0.data)
          this.$toast({
            text: '保存成功',
            type: 'success',
            callBack: () => {
              this.$router.replace('/infoEdit')
              // history.back()
            }
          })
        })
      })
    }
  },
  created () {
    this.getUserInfo()
  },
  mounted () {
  }
}
</script>
<style lang="less">
.edit {
  padding: 0 20px;
  .file {
    width: 100px;
    height: 20px;
  }
  .item {
    padding: 20px 0;
    display: flex;
    .txt {
      flex: 1;
      display: flex;
      align-items: center;
      padding-left: 17px;
      position: relative;
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
        font-weight: 300;
        color: #354048;
        font-size: 30px; /*px*/
      }
      .operResult {
        width: 100%;
        display: block;
        font-weight: 300;
        color: #354048;
        text-align: right;
        font-size: 30px; /*px*/
      }
      .placeholder {
        width: 100%;
        display: block;
        text-align: right;
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