<template>

	<view class="goods-detail-container">

		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item, i) in goods_info.pics" :key="i">
				<image :src="item.pics_big" @click="preview(i)"></image>
			</swiper-item>
		</swiper>

		<!-- 商品信息区域 -->
		<view class="goods-info-box">
			<!-- 商品价格 -->
			<view class="price" v-if="goods_info.goods_price">￥{{goods_info.goods_price}}</view>
			<!-- 信息主体区域 -->
			<view class="goods-info-body">
				<!-- 商品名称 -->
				<view class="goods-name">{{goods_info.goods_name}}</view>
				<!-- 收藏 -->
				<view class="favi">
					<uni-icons type="star" size="18" color="gray"></uni-icons>
					<text>收藏</text>
				</view>
			</view>
			<!-- 运费 -->
			<view class="yf">快递：免运费</view>
		</view>

		<!-- 商品详情信息介绍 -->
		<view class="goods_introduce">
			<rich-text :nodes="goods_info.goods_introduce"></rich-text>
		</view>

		<!-- 商品详情页下面的加入购物车导航 -->
		<view class="goods_nav">
			<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick"
				@buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions,
		mapGetters
	} from "vuex";

	export default {
		data() {
			return {
				// 声明商品详情数据
				goods_info: {},
				// 加入购物车导航需要的数据
				options: [{
					icon: 'headphones',
					text: '客服'
				}, {
					icon: 'cart',
					text: '购物车',
					info: 0
				}],
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: '#ff0000',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ffa200',
						color: '#fff'
					}
				]
			}
		},
		onLoad(options) {
			// 刚进入页面获取到url中的参数，传给获取商品详情方法
			this.getGoodsInfo(options.goods_id)
		},
		methods: {
			// 使用vuex中的映射，把方法映射到商品详情页
			...mapActions('storeCart', ['useAddCart', 'useSaveToStorage']),
			// 获取商品详情方法
			async getGoodsInfo(goods_id) {
				// 发起请求
				const {
					data: res
				} = await uni.$http.get("/api/public/v1/goods/detail", {
					goods_id
				})
				// 判断数据如果获取失败,弹出框提示用户
				if (res.meta.status !== 200) return uni.$toast();
				// 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片底部空白间隙的问题
				res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g,
					'<img style="display:block;" ').replace(/webp/g, 'jpg')
				// 把获取到的数据存储到goods_info属性中
				this.goods_info = res.message
			},
			preview(index) {
				// 使用小程序的previewImage()方法 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。
				uni.previewImage({
					current: index,
					urls: this.goods_info.pics.map(a => a.pics_big)
				})
			},
			// 点击了导航右边的按钮
			onClick(e) {
				// 判断点击的是不是购物车按钮
				if (e.content.text === "购物车") {
					// 如果是跳转到购物车页面
					uni.switchTab({
						url: "../../pages/cart/cart"
					})
				}
			},
			// 点击右边的加入购物车按钮
			buttonClick(e) {
				// 2. 组织一个商品的信息对象
				const goods = {
					goods_id: this.goods_info.goods_id, // 商品的Id
					goods_name: this.goods_info.goods_name, // 商品的名称
					goods_price: this.goods_info.goods_price, // 商品的价格
					goods_count: 1, // 商品的数量
					goods_small_logo: this.goods_info.goods_small_logo, // 商品的图片
					goods_state: true // 商品的勾选状态
				};
				// 调用vuex中的方法,把这些数据存储到vuex中
				this.useAddCart(goods)
				// 调用vuex中的本地存储方法,把数据保存到本地
				this.useSaveToStorage()
			},
		},
		watch: {
			// 侦听导航中购物车的徽标改变
			total: {
				handler(newVal) {
					// 使用find方法找到购物车按钮数据对象
					const findResult = this.options.find(item => item.text === "购物车")
					// 判断是否找到购物车按钮数据对象
					if (findResult) {
						// 如果找到了 把按钮数据对象中的info(徽标数字)更改为最新
						findResult.info = newVal
					}
				},
				// immediate:true 的意思是刚进入页面时当前数据虽然没有侦听到改变,但还是会执行一次侦听方法
				immediate: true
			}
		},
		computed: {
			// 映射vuex中的state数据
			...mapState("storeCart", ["cart"]),
			...mapGetters("storeCart", ["total"])
		}
	};
</script>

<style lang="scss">
	swiper {
		height: 750rpx;

		image {
			width: 100%;
			height: 100%;
		}
	}

	// 商品信息区域的样式
	.goods-info-box {
		padding: 10px;
		padding-right: 0;

		.price {
			color: #c00000;
			font-size: 18px;
			margin: 10px 0;
		}

		.goods-info-body {
			display: flex;
			justify-content: space-between;

			.goods-name {
				font-size: 13px;
				padding-right: 10px;
			}

			// 收藏区域
			.favi {
				width: 120px;
				font-size: 12px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				border-left: 1px solid #efefef;
				color: gray;
			}
		}

		// 运费
		.yf {
			margin: 10px 0;
			font-size: 12px;
			color: gray;
		}
	}

	.goods_nav {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}

	.goods-detail-container {
		padding-bottom: 50px;
	}
</style>
