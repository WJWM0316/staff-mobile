<template>
  <!--打卡发表编辑页-->
  <div class="p-body p-publish-content">
    <div class="form-group">
      <textarea name="content" class="control" maxlength="1000" placeholder="说说你的想法..." v-model="form.content" />
      <p class="addon" :class="{ 'z-active': form.content.length > 0 }"><span class="current">{{form.content.length}}</span>/{{lengths.textMax}}</p>
    </div>
    <div class="images" v-if="addonType === 0 || addonType === 3">
      <div class="item" v-for="(item, index) in images" :key="index">
        <image-item class="image" mode="auto" :src="item.base64Url || item.fileUrl" />
        <button type="button" class="close u-btn" @click="handleDeleteImage(index, item)"><i class="u-icon-delete-image"></i></button>
      </div>
      <a href="#" class="add item" v-if="images.length < lengths.imageMax" @click.prevent.stop="handleAdd"><i class="u-icon-plus"></i></a>
    </div>
    <div class="btn-container">
      <button type="button" class="u-btn-publish" :disabled="!canPublish" @click="handleSubmit">发表</button>
    </div>
    <div class="showTask" @click.stop="showTask" v-if="taskContent.isShowRandomCardContent === 0 && taskContent.courseCardTitle && taskContent.courseCardFile">本节打卡任务 <img src="../../assets/icon/btn_up_task@3x.png"/></div>
    <div class="taskWindow" v-if="showTaskWindow">
      <div class="taskhead" @click.stop="closeTask">本节打卡任务 <img src="../../assets/icon/btn_packup_task@3x.png"/></div>
      <div class="taskbody">
        <div v-html="removeFontSize(taskContent.courseCardTitle)"></div>
        <!--图片-->
        <div class="content-img" v-if="taskContent.courseCardFile && taskContent.courseCardFile.length>0">
          <div class="content-images">
            <!-- 图片为 1 张时 -->
            <div class="item-image one" v-if="taskContent.courseCardFile && taskContent.courseCardFile.length === 1">
              <img :src="taskContent.courseCardFile[0].fileUrl || '../../assets/icon/img_head_default.png'" @click.stop="previewImage(taskContent.courseCardFile[0].fileUrl)" />
            </div>
  
            <!--  图片为 多 张时  -->
            <div class="item-image" v-for="file in taskContent.courseCardFile" v-else>
              <img :src="file.fileUrl || '../../assets/icon/img_head_default.png'" v-if="!file.holder" @click.stop="previewImage(file.fileUrl)" />
            </div>
          </div>
        </div>
      <!--图片-->
      </div>
    </div>
    <!--<actionsheet v-model="addActionsConfig.show" :menus="addActionsConfig.menus" show-cancel @on-click-menu="handleAddActoinItem" />-->
    <!--<wechat-code-modal v-model="wechatCodeModal.show" />-->
    <div class="Mask" v-if="showTaskWindow" @click.stop="closeTask"></div>
  </div>
</template>

<script>
</script>

<style lang="less" scoped>
  @keyframes task-fade-in {
    from {
      opacity: 0;
      transform: translateY(100%);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .p-publish-content {
    position: relative;
    padding: 25px;
    .form-group {
      position: relative;
      margin-bottom: 7px;
      padding-bottom: 20px;
      .control {
        width: 100%;
        line-height: 20px;
        font-size: 15px;
        height: 120px;
        border: none;
        resize: none;
      }
      .addon {
        display: block;
        position: absolute;
        right: 0;
        bottom: 0;
        line-height: 20px;
        font-size: 13px;
        color: #bcbcbc;
        &.z-active .current {
          color: #d7ab70;
        }
      }
    }
    .images {
      display: flex;
      margin: 0 -3px -6px;
      flex-flow: row wrap;
      .item {
        position: relative;
        display: block;
        flex: 0 0 auto;
        box-sizing: border-box;
        margin: 0 3px 6px;
        font-size: 0;
        &>.image {
          background: #f1f1f1;
          width: 102px;
          height: 102px;
          line-height: 100px;
        }
        .close {
          position: absolute;
          right: 0;
          top: 2.5px;
          width: 26px;
          height: 26px;
        }
        &.add {
          width: 102px;
          height: 102px;
          line-height: 100px;
          text-align: center;
          border: solid 1px #ededed;
          /* no */
        }
      }
    }
    .btn-container {
      margin: 40px 0px;
      .u-btn-publish {
        padding: 10px;
        background: #ffe266;
        width: 100%;
        line-height: 24px;
        border-radius: 22px;
        font-size: 15px;
        color: #354048;
        &[disabled] {
          opacity: .5;
        }
        &::after {
          content: none;
        }
      }
    }
    /*打卡任务详情*/
    .showTask{
      display: flex;
      align-items: center;
      justify-content: center;
      color: #929292;
      font-size: 14px;
      img{
        padding-top: 2px;
        padding-left: 2px;
        width: 18px;
        height: 18px;
      }
    }
    /*打卡任务窗口*/
    .taskWindow{
      position: fixed;
      bottom:0;
      left: 0;
      box-sizing: border-box;
      width: 100%;
      height: 363px;
      z-index: 9999;
      animation: task-fade-in 300ms ease-in-out;
      .taskhead{
        width: 100%;
        height: 44px;
        background-color: #F8F8F8;
        border-radius: 20px 20px 0 0;
        color:#929292;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
          margin-left: 2px;
        }
      }
      .taskbody{
        background-color: #FFFFFF;
        padding: 20px;
        height: 319px;
        overflow-y: scroll;
      }
      /*打卡任务图片*/
      .content-img{
        & .content-images {
          margin-top: 10px;
          width: 335px;
          display: flex;
          flex-flow: row wrap;
          & > .item-image {
            margin-top: 5px;
            margin-left: 5px;
            width: 108px;
            height: 108px;
            text-align: center;
            flex-grow:0;
            &:first-of-type, &:nth-of-type(3n + 1) {
              margin-left: 0;
            }
            & img {
              background: #f9f9f9;
              width: 100%;
              height: 100%;
              vertical-align: middle;
            }
          }
          & > .item-image.one {
            width: 136px;
            height: 136px;
          }
        }
      }
    }
    .Mask{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #000;
      opacity: 0.5;
      z-index: 8888;
    }
  }
</style>