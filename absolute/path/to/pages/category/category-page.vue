<template>
  <view class="category-page">
    <!-- 导航栏 -->
    <view class="custom-navbar">
      <view class="navbar-icon back-icon" @click="navBack">
        <text class="yticon icon-zuojiantou-up"></text>
      </view>
      <view class="navbar-title">{{ categoryTitle }}</view>
      <view class="navbar-icon"></view>
    </view>

    <!-- 分类内容区域 -->
    <view class="category-content">
      <!-- 分类头部 -->
      <view class="category-header" :style="{ backgroundColor: categoryBgColor }">
        <text class="category-name">{{ categoryTitle }}</text>
        <text class="category-desc">{{ categoryDesc }}</text>
      </view>

      <!-- 内容列表 -->
      <view class="content-list">
        <view v-for="(item, index) in contentList" :key="index" class="content-item" @click="navToDetail(item)">
          <image :src="item.pic" class="item-image"></image>
          <view class="item-info">
            <text class="item-title clamp">{{ item.name }}</text>
            <text class="item-subtitle clamp">{{ item.subTitle }}</text>
            <text class="item-price" v-if="item.price">￥{{ item.price }}</text>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <uni-load-more :status="loadingType"></uni-load-more>
    </view>
  </view>
</template>

<script>
import { fetchCategoryContent } from '@/api/category.js';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

export default {
  components: {
    uniLoadMore
  },
  data() {
    return {
      categoryType: '',
      categoryTitle: '',
      categoryDesc: '',
      categoryBgColor: '',
      contentList: [],
      pageParams: {
        pageNum: 1,
        pageSize: 10
      },
      loadingType: 'more'
    };
  },
  onLoad(options) {
    // 获取分类类型参数
    this.categoryType = options.type;
    // 根据分类类型初始化页面
    this.initCategoryConfig();
    // 加载分类内容
    this.loadCategoryContent();
  },
  methods: {
    // 初始化分类配置
    initCategoryConfig() {
      const categoryConfig = {
        special: {
          title: '专题',
          desc: '精选专题内容集合',
          bgColor: 'rgb(230, 100, 80)'
        },
        topic: {
          title: '话题',
          desc: '热门话题讨论',
          bgColor: 'rgb(80, 130, 230)'
        },
        preferred: {
          title: '优选',
          desc: '精心挑选的优质内容',
          bgColor: 'rgb(80, 200, 150)'
        },
        discount: {
          title: '特惠',
          desc: '超值特惠活动',
          bgColor: 'rgb(240, 180, 80)'
        }
      };

      // 根据类型获取配置
      const config = categoryConfig[this.categoryType] || categoryConfig.special;
      this.categoryTitle = config.title;
      this.categoryDesc = config.desc;
      this.categoryBgColor = config.bgColor;
    },

    // 加载分类内容
    async loadCategoryContent() {
      try {
        const response = await fetchCategoryContent({
          type: this.categoryType,
          ...this.pageParams
        });
        
        if (this.pageParams.pageNum === 1) {
          this.contentList = response.data;
        } else {
          this.contentList = this.contentList.concat(response.data);
        }
        
        this.loadingType = response.data.length < this.pageParams.pageSize ? 'nomore' : 'more';
      } catch (error) {
        console.error('加载分类内容失败:', error);
        this.loadingType = 'error';
      }
    },

    // 返回上一页
    navBack() {
      uni.navigateBack();
    },

    // 跳转到详情页
    navToDetail(item) {
      uni.navigateTo({
        url: `/pages/product/product?id=${item.id}`
      });
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.pageParams.pageNum = 1;
    this.loadCategoryContent().then(() => {
      uni.stopPullDownRefresh();
    });
  },
  // 上拉加载更多
  onReachBottom() {
    if (this.loadingType === 'more') {
      this.pageParams.pageNum++;
      this.loadingType = 'loading';
      this.loadCategoryContent();
    }
  }
};
</script>

<style lang="scss">
/* 导航栏样式 */
.custom-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 15px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.navbar-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #303133;
}

.navbar-title {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}

/* 分类内容区域 */
.category-content {
  padding-top: 44px;
}

/* 分类头部 */
.category-header {
  padding: 40upx 30upx;
  color: #fff;
  border-radius: 0 0 16upx 16upx;
}

.category-name {
  font-size: 36upx;
  font-weight: bold;
  margin-bottom: 10upx;
}

.category-desc {
  font-size: 24upx;
  opacity: 0.9;
}

/* 内容列表 */
.content-list {
  padding: 20upx 15upx;
  background-color: #f5f5f5;
}

.content-item {
  display: flex;
  background-color: #fff;
  border-radius: 12upx;
  padding: 20upx;
  margin-bottom: 15upx;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.item-image {
  width: 160upx;
  height: 160upx;
  border-radius: 8upx;
  margin-right: 20upx;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-title {
  font-size: 28upx;
  color: #303133;
  margin-bottom: 8upx;
}

.item-subtitle {
  font-size: 24upx;
  color: #909399;
  margin-bottom: 10upx;
}

.item-price {
  font-size: 28upx;
  color: #f56c6c;
  font-weight: 500;
}

/* 文本行数限制 */
.clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2;
}
</style>