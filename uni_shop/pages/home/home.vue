<template>
	<view>
		<!-- 搜索框组件 -->
		<view class="my-search">
			<my-search bgc="#c00000" radius="18" @click="gotoSearchPage"></my-search>
		</view>
		<!-- 1. 轮播图 start -->
		<swiper class="swiper" :indicator-dots="true"  :autoplay="true"  :interval="3000"       :duration="1000"
			 :circular="true">
			<swiper-item v-for="(item,index) in swiperList" :key="item.goods_id">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id">
					<image class="swiper-image" :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		<!-- 1. 轮播图 end -->

		<!-- 2. 导航 start -->
		<view class="nav-list">
			<view class="nav-items" v-for="(item,index) in navList" :key="index" @click="linkNavPage">
				<image class="nav-img" :src="item.image_src" mode=""></image>
			</view>
		</view>
		<!-- 2. 导航 end -->

		<!-- 3. 楼层 start -->
		<view class="floor">
			<!-- 楼层标题 start -->
			<view class="floor-item" v-for="(item,index) in floorList" :key="index">
				<image class="floor-title" :src="item.floor_title.image_src" mode=""></image>
				<!-- 楼层内容 start -->
				<view class="floor-content">
					<navigator class="floor-content-left" :url="item.product_list[0].navigator_url">
						<image :style="'width:' + item.product_list[0].image_width + 'rpx'"
							:src="item.product_list[0].image_src" mode=""></image>
					</navigator>
					<view class="floor-content-right">
						<navigator :url="item2.navigator_url" class="floor-content-right-item"
							v-for="(item2,index2) in item.product_list" :key="index2" v-if="index2 !== 0">
							<image :src="item2.image_src" :style="'width:' + item2.image_width + 'rpx'" mode="widthFix">
							</image>
						</navigator>
					</view>
				</view>
				<!-- 楼层内容 end -->
			</view>
			<!-- 楼层标题 end -->
		</view>
		<!-- 3. 楼层 end -->
	</view>
</template>
<script>
	// 引入mixin页面
	import tabBarBadge from "../../mixin/tabbar-badge.js.js"
	export default {
		mixins: [tabBarBadge],
		data() {
			return {
				swiperList: [],
				navList: [],
				floorList: [],
			}
		},
		methods: {
			// 获取轮播图数据方法
			async getSweiperList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/swiperdata')
				if (res.meta.status !== 200) return uni.$toast();
				this.swiperList = res.message
			},
			// 获取导航数据方法
			async getNavList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/catitems')
				if (res.meta.status !== 200) return uni.$toast();
				this.navList = res.message
			},
			// 跳转分类页面方法
			linkNavPage() {
				uni.switchTab({
					url: "/pages/cate/cate"
				})
			},
			// 获取楼层数据方法
			async getFloorList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/floordata')
				if (res.meta.status !== 200) return uni.$toast();
				this.floorList = res.message
				// 使用双重循环把每个商品的地址更改
				this.floorList.forEach((item, index) => {
					item.product_list.forEach((item2, index2) => {
						item2.navigator_url = '/subpkg/goods_list/goods_list?' + item2.navigator_url
							.split('?')[1]
					})
				})
			},
			// 跳转到搜索页面方法
			gotoSearchPage() {
				uni.navigateTo({
					url: "../../subpkg/search/search"
				})
			}
		},
		onLoad() {
			this.getSweiperList();
			this.getNavList();
			this.getFloorList();
		}
	}
</script>

<style lang="scss" scoped>
	.swiper {
		height: 330rpx;

		.swiper-item,
		image {
			width: 100%;
			height: 100%;
		}
	}

	// 导航区域
	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15px 0;

		.nav-img {
			width: 128rpx;
			height: 140rpx;
		}
	}

	.floor-title {
		height: 60rpx;
		width: 100%;
		display: flex;
	}

	.floor-content {
		display: flex;
		padding-left: 10rpx;
	}

	.floor-content-right {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.my-search {
		position: sticky;
		top: 0px;
		z-index: 999;
	}
</style>
