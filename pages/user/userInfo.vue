<template>
  <view class="profile-page">
    <!-- 头部背景区域 -->
    <view class="user-section">
      <image class="bg" src="/static/user-bg.jpg"></image>
      <text class="bg-upload-btn yticon icon-paizhao"></text>
      <view class="portrait-box">
        <image class="portrait" :src="userInfo.portrait || '/static/missing-face.png'"></image>
        <text class="pt-upload-btn yticon icon-paizhao"></text>
      </view>
    </view>

    <!-- 个人信息表单区域 -->
    <view class="profile-form">
      <view class="list-cell b-b" @click="editField('name')" hover-class="cell-hover" :hover-stay-time="50">
        <text class="cell-tit">姓名</text>
        <text class="cell-value">{{ userInfo.name || '未设置' }}</text>
        <text class="cell-more yticon icon-you"></text>
      </view>
      <view class="list-cell b-b" @click="editField('phone')" hover-class="cell-hover" :hover-stay-time="50">
        <text class="cell-tit">手机号</text>
        <text class="cell-value">{{ userInfo.phone || '未绑定' }}</text>
        <text class="cell-more yticon icon-you"></text>
      </view>
      <view class="list-cell b-b" @click="editField('email')" hover-class="cell-hover" :hover-stay-time="50">
        <text class="cell-tit">生日</text>
        <text class="cell-value">{{ userInfo.email || '未设置' }}</text>
        <text class="cell-more yticon icon-you"></text>
      </view>
      <view class="list-cell b-b" @click="editField('gender')" hover-class="cell-hover" :hover-stay-time="50">
        <text class="cell-tit">性别</text>
        <text class="cell-value">{{ genderMap[userInfo.gender] || '未设置' }}</text>
        <text class="cell-more yticon icon-you"></text>
      </view>
      <view class="list-cell" @click="editField('signature')" hover-class="cell-hover" :hover-stay-time="50">
        <text class="cell-tit">个人签名</text>
        <text class="cell-value cell-multi">{{ userInfo.signature || '未设置' }}</text>
        <text class="cell-more yticon icon-you"></text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      genderMap: {
        0: '未知',
        1: '男',
        2: '女'
      }
    };
  },
  computed: {
    ...mapState(['userInfo']),
  },
  methods: {
    ...mapMutations(['updateUserInfo']),

    // 编辑字段
    editField(field) {
      // 根据字段类型显示不同的编辑界面
      switch(field) {
        case 'name':
        case 'phone':
        case 'email':
          this.showInputDialog(field);
          break;
        case 'gender':
          this.showGenderDialog();
          break;
        case 'signature':
          this.showTextareaDialog();
          break;
      }
    },

    // 输入框对话框
    showInputDialog(field) {
      const titles = {
        name: '修改姓名',
        phone: '修改手机号',
        email: '修改邮箱'
      };
      const value = this.userInfo[field] || '';

      uni.showModal({
        title: titles[field],
        editable: true,
        placeholderText: `请输入${titles[field].slice(2)}`,
        content: value,
        success: (res) => {
          if (res.confirm && res.content !== value) {
            this.updateUserInfo({
              ...this.userInfo,
              [field]: res.content
            });
            this.$api.msg('修改成功');
          }
        }
      });
    },

    // 性别选择对话框
    showGenderDialog() {
      uni.showActionSheet({
        itemList: ['男', '女', '未知'],
        success: (res) => {
          const genderMap = [1, 2, 0];
          const newGender = genderMap[res.tapIndex];
          if (newGender !== this.userInfo.gender) {
            this.updateUserInfo({
              ...this.userInfo,
              gender: newGender
            });
            this.$api.msg('性别设置成功');
          }
        }
      });
    },

    // 多行文本对话框
    showTextareaDialog() {
      uni.showModal({
        title: '修改个人签名',
        editable: true,
        placeholderText: '请输入个人签名（最多50字）',
        content: this.userInfo.signature || '',
        success: (res) => {
          if (res.confirm) {
            const signature = res.content.slice(0, 50);
            this.updateUserInfo({
              ...this.userInfo,
              signature
            });
            this.$api.msg('签名修改成功');
          }
        }
      });
    }
  }
};
</script>

<style lang="scss">
page {
  background: $page-color-base;
}

/* 头部样式继承自userinfo.vue */
.user-section {
  height: 400upx;
}

/* 表单区域样式 */
.profile-form {
  margin-top: -20upx;
  padding-bottom: 20upx;
}

.list-cell {
  display: flex;
  align-items: center;
  padding: 24upx $page-row-spacing;
  background: #fff;
  position: relative;

  .cell-tit {
    font-size: 30upx;
    color: $text-color-primary;
    flex: 2;
  }

  .cell-value {
    font-size: 28upx;
    color: $text-color-secondary;
    flex: 5;
    text-align: right;
    padding-right: 20upx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.cell-multi {
      white-space: normal;
      line-height: 40upx;
      max-height: 80upx;
      text-align: right;
    }
  }

  .cell-more {
    font-size: 32upx;
    color: $text-color-placeholder;
    flex: 1;
    text-align: right;
  }
}
</style>