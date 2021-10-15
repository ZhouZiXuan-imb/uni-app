<template>
<view class="cart-container">
	<view v-if="cart.length !== 0">
		<!-- 购物车收货地址区域 -->
		<view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
			<button class="address-button" type="primary" size="mini" @click="chooseAddress">请选择收货地址+</button>
		</view>
	
		<!-- 引入地址信息组件 -->
		<my-address v-else @update-address="chooseAddress"></my-address>
	
		<!-- 收货地址下面的border -->
		<image src="/static/cart_border@2x.png" class="address-border"></image>
	
	
		<!-- 购物车商品列表的标题区域 -->
		<view class="cart-title">
			<!-- 左侧的图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 描述文本 -->
			<text class="cart-title-text">购物车</text>
		</view>
	
		<!-- 商品列表区域 -->
		<my-goods :goods="cart" :showRadio="true" :showNumBox="true" @radio-change="radioChangeHandler" @numbox-change="numBoxChangeHandler"></my-goods>
	
		<view class="my-settle-container">
			<my-settle></my-settle>
		</view>
	
	</view>
	
	
	
	<!-- 空白购物车区域 -->
	<view class="empty-cart" v-else>
		<image src="/static/cart_empty@2x.png" class="empty-img"></image>
		<text class="tip-text">空空如也~</text>
	</view>
</view>
</template>

<script>
	// 引入mixin页面
	import tabBarBadge from "../../mixin/tabbar-badge.js.js"

	// 引入vuex  mapState, mapActions方法
	import {
		mapState,
		mapActions,
		mapGetters
	} from "vuex"

	export default {
		// 使用mixin文件
		mixins: [tabBarBadge],
		data() {
			return {

			}
		},
		methods: {
			// 映射出vuex中的actions方法
			...mapActions("storeCart", ["useChangeRadio", "useSaveToStorage", "useChangeNumBox"]),
			...mapActions("storeUserAddress", ["useSetAddress"]),
			// 父组件中定义的方法，这个方法是子组件使用$emit触发的自定义事件的函数，用来切换购物车中radio的选中和不选中
			radioChangeHandler(e) {
				// 调用vuex中的方法更改radio状态
				this.useChangeRadio(e)
				// 调用vuex中的方法吧更改过后的数据存储到本地
				this.useSaveToStorage();
			},
			// 父组件中定义的方法，这个方法是子组件使用$emit触发的自定义事件的函数，用来控制购物车中某个商品数量的numBox
			numBoxChangeHandler(e) {
				// 调用vuex中的方法更改numBox的数字
				this.useChangeNumBox(e)
				// 调用vuex中的方法吧更改过后的数据存储到本地
				this.useSaveToStorage();
				// 每次更改的时候，让tabBar中的徽标也跟着更改，这个方法在mixin徽标文件中定义了
				this.setBadge();
			},
			// 点击购物车中的请选择收货地址按钮调用方法
			async chooseAddress() {
				// 使用小程序中自带的chooseAddress()方法来弹出地址信息，让用户选择地址，这个方法返回值是一个数组，数组中第一个返回值是错误信息，第二个返回值是选择成功后用户的信息
				const [err, succ] = await uni.chooseAddress().catch((err) => err)

				// 判断是否没有错误，并且返回值为成功
				if (err === null && succ.errMsg === "chooseAddress:ok") {
					// 把成功的地址信息传给vuex中的方法，把这个数据保存在vuex中
					this.useSetAddress(succ)
				}

				// 3. 用户没有授权
				if (err && err.errMsg === 'chooseAddress:fail auth deny') {
					this.reAuth() // 调用 this.reAuth() 方法，向用户重新发起授权申请
				}
			},
			async reAuth() {
				// 3.1 提示用户对地址进行授权
				const [err2, confirmResult] = await uni.showModal({
					content: '检测到您没打开地址权限，是否去设置打开？',
					confirmText: "确认",
					cancelText: "取消",
				})

				// 3.2 如果弹框异常，则直接退出
				if (err2) return

				// 3.3 如果用户点击了 “取消” 按钮，则提示用户 “您取消了地址授权！”
				if (confirmResult.cancel) return uni.$toast('您取消了地址授权！')

				// 3.4 如果用户点击了 “确认” 按钮，则调用 uni.openSetting() 方法进入授权页面，让用户重新进行授权
				if (confirmResult.confirm) return uni.openSetting({
					// 3.4.1 授权结束，需要对授权的结果做进一步判断
					success: (settingResult) => {
						// 3.4.2 地址授权的值等于 true，提示用户 “授权成功”
						if (settingResult.authSetting['scope.address']) return uni.$toast('授权成功！请选择地址')
						// 3.4.3 地址授权的值等于 false，提示用户 “您取消了地址授权”
						if (!settingResult.authSetting['scope.address']) return uni.$toast('您取消了地址授权！')
					}
				})
			}
		},
		computed: {
			// 使用vuex映射state属性的方法
			...mapState("storeCart", ["cart"]),
			...mapState("storeUserAddress", ["address"])
		}
	}
</script>

<style lang="scss">
	.cart-title {
		height: 40px;
		display: flex;
		align-items: center;
		font-size: 14px;
		padding-left: 5px;
		border-bottom: 1px solid #efefef;

		.cart-title-text {
			margin-left: 10px;
		}
	}

	.address-border {
		display: block;
		width: 100%;
		height: 5px;
	}

	.address-choose-box {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100px;
		width: 100%;
	}

	.empty-cart {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 150px;

		.empty-img {
			width: 90px;
			height: 90px;
		}

		.tip-text {
			font-size: 12px;
			color: gray;
			margin-top: 15px;
		}
	}

	.my-settle-container {
		/* 底部固定定位 */
		position: fixed;
		bottom: 0;
		left: 0;
		/* 设置宽高和背景色 */
		width: 100%;
		height: 50px;
		background-color: cyan;
	}
	
	.cart-container {
	  padding-bottom: 50px;
	}
</style>
