<template>
	<!-- 收货地址区域 -->
	<view class="address-info-box" @click="updateChooseAddress">
		<view class="address-info-box-top">
			<view class="address-info-box-top-left">
				收货人：{{address.userName}}
			</view>
			<view class="address-info-box-top-right">
				电话：{{address.telNumber}}
			</view>
		</view>
		<view class="address-info-box-bottom">
			<view class="address-info-box-bottom-address">
				收货地址：{{addStr}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters
	} from "vuex"
	export default {
		name: "my-address",
		data() {
			return {

			};
		},
		methods: {
			// 点击地址信息时触发
			updateChooseAddress() {
				// 出发父组件中的方法
				this.$emit("update-address")
			}
		},
		computed: {
			// 使用vuex映射state属性的方法
			...mapState("storeUserAddress", ["address"]),
			...mapGetters("storeUserAddress",["addStr"])
		}
	}
</script>

<style lang="scss">
	.address-info-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 5px;
		font-size: 12px;
		height: 90px;

		.address-info-box-top {
			display: flex;
			justify-content: space-between;
		}
	}
</style>
