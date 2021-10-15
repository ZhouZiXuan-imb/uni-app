<template>
	<uni-swipe-action>
		<view class="goods-list">
			<block v-for="(item, i) in goods" :key="i">
				<uni-swipe-action-item :right-options="rightOptions" @click="removeGoods($event,item.goods_id)">
					<view @click="gotoGoodsDetail(item.goods_id)" class="goods-item">
						<!-- 商品左侧图片区域 -->
						<view class="goods-item-left">
							<radio :checked="item.goods_state" v-if="showRadio" color="#C00000"
								@click="radioChangeHandler(item)" />
							<image :src="item.goods_small_logo || defaultPic" class="goods-pic"></image>
						</view>
						<!-- 商品右侧信息区域 -->
						<view class="goods-item-right">
							<!-- 商品标题 -->
							<view class="goods-name">{{item.goods_name}}</view>
							<view class="goods-info-box">
								<!-- 商品价格 -->
								<view class="goods-price">￥{{priceFixed(item.goods_price)}}</view>
								<uni-number-box v-if="showNumBox" :value="item.goods_count" :min="1"
									@change="numBoxChangeHandler(item,$event)"></uni-number-box>
							</view>
						</view>
					</view>
				</uni-swipe-action-item>
			</block>
		</view>
	</uni-swipe-action>
</template>

<script>
	import {mapActions} from "vuex"
	import mixins from "../../mixin/tabbar-badge.js.js"
	export default {
		mixins:[mixins],
		props: {
			goods: {
				type: Array,
				default: []
			},
			showRadio: {
				type: Boolean,
				default: true
			},
			showNumBox: {
				type: Boolean,
				default: true
			}
		},
		name: "my-goods",
		data() {
			return {
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
				rightOptions:[
					{
						text:"取消",
						style:{backgroundColor:"#eee"}
					},
					{
						text:"删除",
						style:{backgroundColor:"#c00000"}
					},
				]
			};
		},
		methods: {
			...mapActions("storeCart",["useChangeCartList","useSaveToStorage"]),
			priceFixed(goods_price) {
				return Number(goods_price).toFixed(2)
			},
			// 点击子组件中的方法，触发父组件的点击事件
			gotoGoodsDetail(goods_id) {
				this.$emit("click", goods_id)
			},
			// 点击子组件中的方法，触发父组件的自定义事件
			radioChangeHandler(e) {
				this.$emit("radio-change", {
					goods_id: e.goods_id,
					goods_state: e.goods_state
				})
			},
			// 商品的numBox改变的方法
			numBoxChangeHandler(e, val) {
				// 商品数量改变后，判断一下用户在numBox中输入的是不是空、中文、有没有小数点
				if (val.length !== 0 && Number(val) !== NaN && String(val).indexOf(".") === -1) {
					// 如果是正常数字就触发父组件中的方法
					this.$emit("numbox-change", {
						goods_id: e.goods_id,
						goods_count: +val,
					})
				}
			},
			removeGoods(e,goodsId) {
				// 判断点击的按钮是不是删除
				if(e.content.text === "删除") {
					// 如果点击的是删除，就把商品id传过来，使用筛选方法，找到购物车中 除了要 删除 的商品的其他所有商品
					const newGoodsArr = this.goods.filter(item => item.goods_id !== goodsId)
					// 调用vuex中的方法删除商品
					this.useChangeCartList(newGoodsArr);
					// 调用vuex中的方法把vuex中cart属性更新后的数据保存到本地
					this.useSaveToStorage();
					// 调用mixin中的徽标方法，让购物车徽标的数字更新
					this.setBadge();
				}
			},
		}
	}
</script>

<style lang="scss">
	.goods-item {
		display: flex;
		padding: 10px 5px;
		border-bottom: 1px solid #f0f0f0;

		.goods-item-left {
			margin-right: 5px;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.goods-pic {
				width: 100px;
				height: 100px;
				display: block;
			}
		}

		.goods-item-right {
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.goods-name {
				font-size: 13px;
			}

			.goods-price {
				font-size: 16px;
				color: #c00000;
			}
		}
	}

	.goods-item-right {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: space-between;

		.goods-name {
			font-size: 13px;
		}

		.goods-info-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.goods-price {
			font-size: 16px;
			color: #c00000;
		}
	}
</style>
