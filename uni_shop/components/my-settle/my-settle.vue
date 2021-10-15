<template>

	<!-- 最外层的容器 -->
	<view class="my-settle-container">
		<!-- 全选区域 -->
		<label class="radio" @click="fullCheck">
			<radio color="#C00000" :checked="isFullCheck"  /><text>全选</text>
		</label>

		<!-- 合计区域 -->
		<view class="amount-box">
			合计:<text class="amount">￥{{price}}</text>
		</view>

		<!-- 结算按钮 -->
		<view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
	</view>
</template>

<script>
	import {mapGetters,mapState,mapActions} from "vuex"
	export default {
		data() {
			return {

			};
		},
		methods:{
			...mapActions("storeCart",["useChangeAllGoodsState"]),
			// 点击全选按钮，让所有商品全部选中
			fullCheck() {
				this.useChangeAllGoodsState(!this.isFullCheck)
			},
			settlement() {
				if(!this.checkedCount) return uni.$toast("请选择您要结算的商品！")
				if(!this.addStr) return uni.$toast("请选择您的收货地址！")
				if(!this.token) return uni.$toast("您还没登录，请先登录！")
			}
		},
		computed:{
			...mapGetters("storeCart",["checkedCount","total","price"]),
			...mapGetters("storeUserAddress",["addStr"]),
			isFullCheck() {
				return this.total === this.checkedCount
			}
		}
	}
</script>

<style lang="scss">
	.my-settle-container {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50px;
		// 将背景色从 cyan 改为 white
		background-color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 5px;
		font-size: 14px;

		.radio {
			display: flex;
			align-items: center;
		}

		.amount {
			color: #c00000;
		}

		.btn-settle {
			height: 50px;
			min-width: 100px;
			background-color: #c00000;
			color: white;
			line-height: 50px;
			text-align: center;
			padding: 0 10px;
		}
	}
</style>
