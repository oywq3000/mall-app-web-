<template>
  <view class="profile-page">
    <!-- 头部背景区域 -->
    <view class="user-section">
      <image class="bg" src="/static/user-bg.jpg"></image>
      <text class="bg-upload-btn yticon icon-paizhao"></text>
      <view class="portrait-box">
        <image class="portrait" :src="userInfo.icon || '/static/missing-face.png'" @click="uploadPortraitHandle">
        </image>
        <text class="pt-upload-btn yticon icon-paizhao"></text>
      </view>
    </view>

    <!-- 个人信息表单区域 -->
    <view class="profile-form">
      <view class="list-cell b-b" @click="editField('nickname')" hover-class="cell-hover" :hover-stay-time="50">
        <text class="cell-tit">姓名</text>
        <text class="cell-value">{{ userInfo.nickname || '未设置' }}</text>
        <text class="cell-more yticon icon-you"></text>
      </view>
      <view class="list-cell b-b" @click="editField('phone')" hover-class="cell-hover" :hover-stay-time="50">
        <text class="cell-tit">手机号</text>
        <text class="cell-value">{{ userInfo.phone || '未绑定' }}</text>
        <text class="cell-more yticon icon-you"></text>
      </view>
      <picker mode="date" :value="date" @change="bindDateChange">
        <view class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50">
          <text class="cell-tit">生日</text>
          <view class="cell-value">{{ formatDate(userInfo.birthday) || '未设置' }}</view>
          <text class="cell-more yticon icon-you"></text>
        </view>
      </picker>
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
import { updateInfo } from '@/api/member.js'
import { uploadPortrait } from '@/api/minio.js';
export default {
  data() {
    return {
      genderMap: {
        0: '未知',
        1: '男',
        2: '女'
      },
      showBirthdayPicker: true,
      date: new Date().toISOString().split('T')[0]
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
      switch (field) {
        case 'nickname':
        case 'phone':
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
        nickname: '修改姓名',
        phone: '修改手机号',
        birthday: '修改生日'
      };
      const value = this.userInfo[field] || '';
      uni.showModal({
        title: titles[field],
        editable: true,
        placeholderText: `请输入${titles[field].slice(2)}`,
        content: value,
        success: (res) => {
          if (res.confirm && res.content !== value) {
            this.$store.dispatch('updateMemberInfoAction', { [field]: res.content })
            this.$api.msg('修改成功');
          }
        }
      });
    },

    // 显示日期选择器
    showBirthdayDialog() {
      this.showBirthdayPicker = true;
      // 强制触发选择器弹出（关键步骤）

    },
    // 性别选择对话框
    showGenderDialog() {
      uni.showActionSheet({
        itemList: ['男', '女', '未知'],
        success: (res) => {
          const genderMap = [1, 2, 0];
          const newGender = genderMap[res.tapIndex];
          if (newGender !== this.userInfo.gender) {
            this.$store.dispatch('updateMemberInfoAction', { gender: newGender });
            this.$api.msg('性别设置成功');
          }
        }
      });
    },

    bindDateChange(newBirthday) {
      if (newBirthday.detail.value !== this.formatDate(this.userInfo.birthday)) {
        this.$store.dispatch('updateMemberInfoAction', { birthday: newBirthday.detail.value });
        this.$api.msg('生日修改成功');
      } else {
        this.$api.msg('日期重复');
      }
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
              signature
            });
            this.$api.msg('签名修改成功');
          }
        }
      });
    },

    formatDate(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    },

    // 添加头像上传方法
    uploadPortraitHandle() {
      // 选择图片
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          const tempFilePaths = res.tempFilePaths[0];
          uni.showLoading({ title: '上传中...' });
          // 调用上传接口
          uploadPortrait(tempFilePaths)
            .then(data => {
              // 更新用户头像
              this.$store.dispatch('updateMemberInfoAction', { icon: data.url });
              this.$api.msg('头像上传成功');
            })
            .catch(err => {
              this.$api.msg(err || '头像上传失败');
            })
            .finally(() => {
              uni.hideLoading();
            });
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
  height: 520upx;
  padding: 100upx 30upx 0;
  position: relative;
  display: flex;
  justify-content: center;

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    filter: blur(1px);
    opacity: .7;
  }

  .portrait-box {
    width: 250rpx;
    height: 250rpx;

    .portrait {
      width: 100%;
      height: 100%;
      // 添加圆形样式
      border-radius: 50%;
      // 添加边框（可选）
      border: 4rpx solid #fff;
      // 防止图片变形
      object-fit: cover;
    }
  }
}

/* 表单区域样式 */
.profile-form {
  margin-top: -20rpx;
  padding-bottom: 20rpx;
}

.list-cell {
  display: flex;
  align-items: center;
  padding: 24rpx $page-row-spacing;
  background: #fff;
  position: relative;

  .cell-tit {
    font-size: 30rpx;
    color: $font-color-light;
    flex: 2;
  }

  .cell-value {
    font-size: 28rpx;
    color: $font-color-light;
    flex: 5;
    text-align: right;
    padding-right: 20rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.cell-multi {
      white-space: normal;
      line-height: 40rpx;
      max-height: 80rpx;
      text-align: right;
    }
  }

  .cell-more {
    font-size: 32rpx;
    color: $font-color-light;
    flex: 1;
    text-align: right;
  }
}

.date-picker {
  height: 250;
}

.uni-title {
  font-size: 30rpx;
  font-weight: 500;
  padding: 20rpx 0;
  line-height: 1.5;
}

.uni-common-pl {
  padding-left: 30rpx;
}

.uni-list {
  background-color: #FFFFFF;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.uni-list-cell-left {
  white-space: nowrap;
  font-size: 28rpx;
  padding: 0 30rpx;
}

.uni-list-cell-db,
.uni-list-cell-right {
  flex: 1;
}

.uni-input {
  height: 50rpx;
  padding: 15rpx 25rpx;
  line-height: 50rpx;
  font-size: 28rpx;
  background: #FFF;
  flex: 1;
}
</style>