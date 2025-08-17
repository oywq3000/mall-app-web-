<template>
	<view>
		<view class="notice-list">
			<!-- 动态渲染公告列表 -->
			<view v-for="(item, index) in noticeList" :key="index" class="notice-item">
				<text class="time">{{formatDate(item.startDate )}}</text>
				<view class="content" @click="navToUrl(item)">
					<text class="title">{{ item.title }}</text>
					<view class="img-wrapper">
						<image class="pic" :src="item.pic"></image>
						<view class="cover" v-if="item.status === 0">活动结束</view>
					</view>
					<text class="introduce" v-if="item.introduce">{{ item.introduce }}</text>
					<view class="bot b-t">
						<text>查看详情</text>
						<text class="more-icon yticon icon-you"></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import {fetchNotices} from '@/api/notice.js'
export default {
	data() {
		return {
			// 公告数据列表
			noticeList: [
				/* {
					time: '11:30',
					title: '新品上市，全场满199减50',
					pic: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556465765776&di=57bb5ff70dc4f67dcdb856e5d123c9e7&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01fd015aa4d95fa801206d96069229.jpg%401280w_1l_2o_100sh.jpg',
					introduce: '虽然做了一件好事，但很有可能因此招来他人的无端猜测，例如被质疑是否藏有其他利己动机等，乃至谴责。即便如此，还是要做好事。',
					status: 1,
					url: 1
				},
				{
					time: '昨天 12:30',
					title: '新品上市，全场满199减50',
					pic: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3761064275,227090144&fm=26&gp=0.jpg',
					introduce: '',
					status: 0,
					url: 1
				},
				{
					time: '2024-07-26 12:30',
					title: '新品上市，全场满199减50',
					pic: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556465765776&di=57bb5ff70dc4f67dcdb856e5d123c9e7&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01fd015aa4d95fa801206d96069229.jpg%401280w_1l_2o_100sh.jpg',
					introduce: '新品上市全场2折起，新品上市全场2折起，新品上市全场2折起，新品上市全场2折起，新品上市全场2折起',
					status: 0,
					url: 1
				} */
			]
		}
	},
	onLoad(){
		fetchNotices().then(response=>{
			console.log("loading:",response.data);
			this.noticeList = response.data;
		})
	},
	methods: {
		navToUrl(item){
			uni.navigateTo({
				url: `item.url`
			})
		},
		formatDate(timestamp) {
		  if (!timestamp) return '';
		  const date = new Date(timestamp);
		  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
		}
	}
}
</script>

<style lang='scss'>
page {
	background-color: #f7f7f7;
	padding-bottom: 30upx;
}

.notice-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.time {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 80upx;
	padding-top: 10upx;
	font-size: 26upx;
	color: #7d7d7d;
}

.content {
	width: 710upx;
	padding: 0 24upx;
	background-color: #fff;
	border-radius: 4upx;
}

.title {
	display: flex;
	align-items: center;
	height: 90upx;
	font-size: 32upx;
	color: #303133;
}

.img-wrapper {
	width: 100%;
	height: 260upx;
	position: relative;
}

.pic {
	display: block;
	width: 100%;
	height: 100%;
	border-radius: 6upx;
}

.cover {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, .5);
	font-size: 36upx;
	color: #fff;
}

.introduce {
	display: inline-block;
	padding: 16upx 0;
	font-size: 28upx;
	color: #606266;
	line-height: 38upx;
}

.bot {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 80upx;
	font-size: 24upx;
	color: #707070;
	position: relative;
}

.more-icon {
	font-size: 32upx;
}
</style>
