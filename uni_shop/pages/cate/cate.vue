<template>
	<view>
		<!-- 搜索框部分 start -->
		<view class="my-search">
			<my-search bgc="#c00000" radius="18" @click="gotoSearchPage"></my-search>
		</view>
		<!-- 搜索框部分 end -->
		<view class="scroll-view-container">
			<!-- 左侧的滚动视图区域 -->
			<scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
				<block v-for="(item,index) in cateList" :key="index">
					<view :class="['left-scroll-view-item',index == activeIndex?'active':'']" @click="setActive"
						:data-index="index">{{item.cat_name}}</view>
				</block>
			</scroll-view>
			<!-- 右侧的滚动视图区域 -->
			<scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item2, i2) in cateList[activeIndex].children" :key="i2">
					<view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
					<!-- 动态渲染三级分类的列表数据 -->
					<view class="cate-lv3-list">
						<!-- 三级分类 Item 项 -->
						<view class="cate-lv3-item" v-for="(item3, i3) in item2.children"
							@click="gotoGoodsList(item3.cat_id)" :key="i3">
							<!-- 图片 -->
							<image :src="item3.cat_icon"></image>
							<!-- 文本 -->
							<text>{{item3.cat_name}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	// 引入mixin页面
	import tabBarBadge from "../../mixin/tabbar-badge.js.js"
	export default {
		mixins: [tabBarBadge],
		data() {
			return {
				wh: "",
				cateList: [],
				activeIndex: 0,
				scrollTop: 0,
			}
		},
		methods: {
			// 获取分类数据
			async getCateList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/categories');
				if (res.meta.status !== 200) return uni.$toast();
				this.cateList = res.message;
			},
			// 设置active类名
			setActive(e) {
				this.activeIndex = e.currentTarget.dataset.index

				this.scrollTop = this.scrollTop == 0 ? 1 : 0
				// console.log(e.currentTarget.dataset.index)
			},
			// 跳转到商品列表页面
			gotoGoodsList(cat_id) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?cid=' + cat_id
				})
			},
			// 跳转到搜索页面方法
			gotoSearchPage() {
				uni.navigateTo({
					url: "/subpkg/search/search"
				})
			}
		},
		async onLoad() {
			// 获取高度
			const h = await uni.getSystemInfo();
			this.wh = h[1].windowHeight
			// 调用获取分类数据方法
			this.getCateList();
		},

	}
</script>

<style lang="scss" scoped>
	.scroll-view-container {
		display: flex;

		.right-scroll-view {
			text-align: center;
			font-size: 35rpx;

			.cate-lv3-list {
				display: flex;
				flex-wrap: wrap;

				.cate-lv3-item {
					width: 33.33%;
					margin-bottom: 10px;
					display: flex;
					flex-direction: column;
					align-items: center;
				}

				image {
					width: 60px;
					height: 60px;
				}

				text {
					font-size: 12px;
				}
			}
		}
	}

	.left-scroll-view {
		width: 120px;

		.left-scroll-view-item {
			line-height: 60px;
			background-color: #f7f7f7;
			text-align: center;
			font-size: 12px;



			// 激活项的样式
			&.active {
				background-color: #ffffff;
				position: relative;

				// 渲染激活项左侧的红色指示边线
				&::before {
					content: ' ';
					display: block;
					width: 3px;
					height: 30px;
					background-color: #c00000;
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
				}
			}
		}
	}

	.my-search {
		position: sticky;
		top: 0px;
		z-index: 999;
	}
</style>
