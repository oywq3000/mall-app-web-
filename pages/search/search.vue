<template>
  <view class="search-page">
    <view class="custom-navbar">
      <!-- 返回按钮 -->
      <view>
        <image src="/static/svg/back1.svg" style="height: 36rpx;width: 36rpx;" @click="onClickBack()"></image>
      </view>
      <!-- 搜索框 -->
      <view class="search-container">
        <image src="/static/svg/search.svg" style="height: 20px;width: 20px; margin-right: 5px;"></image>
        <input style="width: 100%;" focus="true" type="text" v-model=searchValue @confirm="onSearchInputConfirmed()"
          placeholder="手机" />
      </view>
    </view>

    <view class="search-input" v-if="displayTyep == '0'">
      <!-- 热门搜索（大家都在搜） -->
      <view class="hot-search" v-if="hotSearchList.length">
        <view class="hot-title">
          <text>大家都在搜</text>
        </view>
        <view class="tag-list">
          <text class="tag-item" v-for="(tag, index) in hotSearchList" :key="index" @click="handleHotTagClick(tag)">{{
            tag }}</text>
        </view>
      </view>
      <!-- 搜索历史 -->
      <view class="history-search" v-if="searchHistory.length">
        <view class="history-title">
          <text>搜索历史</text>
        </view>

        <view class="history-list">
          <view class="history-item" v-for="(history, index) in searchHistory" :key="index">
            <image src="/static/svg/search_history.svg" style="height:32rpx; width: 32rpx;"></image>
            <text class="history-text" @click="handleHistoryClick(history.keyword)">{{ history.keyword }}</text>
            <text class="delete-icon" @click="handleDeleteHistory(history.id)">×</text>
          </view>
        </view>
        <text class="clear-btn" @click="clearHistory">清除历史记录</text>
      </view>
    </view>
    <view class="search-inputting" v-else-if="displayTyep == 1">
      <text>正在搜索</text>
    </view>
    <view class="search-after" v-else-if="displayTyep == 2">
      <view class="sort-bar">
        <view class="sort-item" v-for="(item, index) in sortOptions" :key="index"
          :class="{ 'active': currentSortIndex === index }" @click="handleSortChange(index)">
          {{ item.text }}
        </view>
      </view>
      <view class="item-section">
        <view v-for="(item, index) in productList" :key="index" class="guess-item" @click="navToDetailPage(item)">
          <view class="image-wrapper">
            <image :src="item.pic" mode="aspectFill"></image>
          </view>
          <view class="txt">
            <text class="title clamp">{{ item.name }}</text>
            <text class="title2">{{ item.subTitle }}</text>
            <text class="price">￥{{ item.price }}</text>
          </view>
        </view>
      </view>
	  <uni-load-more :status="loadingType"></uni-load-more>
    </view>
  </view>
</template>

<script>
import { deleteHistory, searchHistorys, searchProducts } from '@/api/search.js';
export default {

  data() {
    return {
      displayTyep: '0', //0->展示未开始搜索的页面，1->展示正在搜索的页面，2->展示完成搜索，展示窗口的页面
      searchValue: '', // 搜索框内容
      searchParms: {
        keyword: '',
        pageNum: 1,
        pageSize: 5,
        sort: 0
      },
      productList: [],
      hotSearchList: [
        '夏季连衣裙',
        '无线蓝牙耳机',
        '家用空气净化器',
        '智能手表',
        '防晒霜SPF50+',
        '儿童绘本推荐',
        '小米手环8',
        '华为MateBook X Pro'
      ], // 热门搜索标签
      searchHistory: [] // 搜索历史，实际可存 localStorage
      ,
      sortOptions: [
        { text: '相关度', value: 'relevance' },
        { text: '按新品', value: 'newest' },
        { text: '按销量', value: 'sales' },
        { text: '价格增', value: 'priceAsc' },
        { text: '价格减', value: 'priceDesc' }
      ],
      currentSortIndex: 0,
      currentSort: 'relevance',
	  loadingType:''
    }
  },
  methods: {
    // 确认搜索（点击键盘“搜索”或按钮）
    handleSearch() {
      //if (!this.searchValue.trim()) return;
      // 1. 调用搜索逻辑（如接口请求）
      // 2. 记录搜索历史
      this.addToHistory(this.searchValue);
	  //设置pagenNum为1
	  this.searchParms.pageNum=1;
      this.searchParms.keyword = this.searchValue;
      // 3. 跳转结果页或处理搜索逻辑
      searchProducts(this.searchParms).then(response => {
        console.log(response);
        this.productList = response.data.list;
		uni.stopPullDownRefresh();
      });
      
      this.displayTyep = '2'
    },
	handleSortChange(index){
	   this.currentSortIndex = index;
	   this.searchParms.sort = index;
	   this.handleSearch();
	},
    // 输入时触发（可选，如做实时搜索）
    handleInput(e) {
      this.searchValue = e.detail.value;
    },
    // 点击“取消”
    handleCancel() {
      // 可返回上一页或清空搜索
      uni.navigateBack();
    },
    // 点击热门标签
    handleHotTagClick(tag) {
      this.searchValue = tag;
      this.handleSearch(); // 直接触发搜索
    },
    // 点击历史记录
    handleHistoryClick(history) {
      this.searchValue = history;
      this.handleSearch();
    },
    // 添加搜索历史（去重）
    addToHistory(keyword) {
      // 去重：如果已存在则删除原有，再 unshift 到最前
      const index = this.searchHistory.indexOf(keyword);
      if (index !== -1) {
        this.searchHistory.splice(index, 1);
      }
      this.searchHistory.unshift(keyword);
      // 实际可存到 localStorage：uni.setStorageSync('searchHistory', this.searchHistory)
    },
    // 删除单条历史
    handleDeleteHistory(id) {
      deleteHistory({ids:id}).then(response=>{
		  this.handleSearchHistory();
	  })
    },
    // 清除全部历史
    clearHistory() {
	  const idList = this.searchHistory.map(item => item.id);
	  deleteHistory({ids:idList}).then(response=>{
		  this.handleSearchHistory();
	  })
    },
    onClickBack() {
      uni.navigateBack({
        delta: 1 // 返回上一页
      });
    },
    onSearchInputConfirmed() {
      console.log("search:" + this.searchValue)
      this.handleSearch();
    },
	handleSearchHistory(){
		searchHistorys().then(response=>{
			 console.log(response.data)
			 this.searchHistory = response.data;
		})
	}
  },
  //下拉刷新
  onPullDownRefresh() {
  	this.searchParms.pageNum = 1;
  	this.handleSearch();
  },
  //加载更多
  onReachBottom() {
  	this.searchParms.pageNum++;
  	this.loadingType = 'loading';
  	searchProducts(this.searchParms).then(response => {
  		let addProductList = response.data.list;
  		if (addProductList.length === 0) {
  			//没有更多了
  			this.searchParms.pageNum--;
  			this.loadingType = 'nomore';
  		} else {
  			this.productList = this.productList.concat(addProductList);
  			this.loadingType = 'more';
  		}
  	})
  },
  
  onLoad() {
    // 实际开发可从 localStorage 读取历史记录
    // const history = uni.getStorageSync('searchHistory');
    // if (history) this.searchHistory = history;
	   this.handleSearchHistory();
  }

}
</script>

<style lang="scss">


.sort-bar {
  display: flex;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.sort-item {
  flex: 1;
  height: 80upx;
  line-height: 80upx;
  text-align: center;
  font-size: $font-lg;
  color: #333;
  position: relative;
}

.sort-item.active {
  color: #FF5252;
}

.sort-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40upx;
  height: 4upx;
  background-color: #FF5252;
  border-radius: 2upx;
}

.search-page {
  padding: 16rpx;
  background-color: #fff;
}

/* 自定义导航条 */
.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 15px;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 搜索框容器 */
.search-container {
  flex: 1;
  height: 32px;
  background: rgba(231, 231, 231, 0.7);
  border-radius: 16px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  margin: 0 10px;
  transition: all 0.3s;
}

.cancel-btn {
  font-size: 32rpx;
  color: #007aff;
}

/* 热门搜索 */
.hot-search {
  margin-top: 32rpx;
}

.hot-title {
  font-size: 25rpx;
  margin-left: 8rpx;
  margin-bottom: 25rpx;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.tag-item {
  padding: 12rpx 24rpx;
  background-color: #f5f5f5;
  border-radius: 20rpx;
  font-size: 28rpx;
}

/* 搜索历史 */
.history-search {
  margin-top: 52rpx;
}

.history-title {
  font-size: 25rpx;
  margin-left: 8rpx;
  margin-bottom: 25rpx;
}

.history-list {
  border-bottom: 1px solid #eee;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: left;
  height: 80rpx;
  padding: 0 16rpx;
  border-bottom: 1px solid #eee;
}

.history-text {
  font-size: 28rpx;
  margin-left: 12rpx;
  width: 90%;
}

.delete-icon {
  font-size: 36rpx;
  margin-left: auto;
  color: #999;
}

.clear-btn {
  display: block;
  margin-top: 16rpx;
  font-size: 26rpx;
  color: #637588;
  text-align: center;
}

.item-section {
  display: flex;
  flex-wrap: wrap;
  padding: 0 30upx;
  background: #fff;

  .guess-item {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding-bottom: 40upx;
  }

  .image-wrapper {
    width: 30%;
    height: 250upx;
    border-radius: 3px;
    overflow: hidden;

    image {
      width: 100%;
      height: 100%;
      opacity: 1;
    }
  }

  .title {
    font-size: $font-lg;
    color: $font-color-dark;
    line-height: 80upx;
  }

  .title2 {
    font-size: $font-sm;
    color: $font-color-light;
    line-height: 40upx;
    height: 80upx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }

  .price {
    font-size: $font-lg;
    color: $uni-color-primary;
    line-height: 80upx;
  }

  .txt {
    width: 70%;
    display: flex;
    flex-direction: column;
    padding-left: 40upx;
  }
}
</style>
