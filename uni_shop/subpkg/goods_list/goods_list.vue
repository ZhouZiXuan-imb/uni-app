<template>
	<view>
		<view class="goods-list">
			<my-goods @click="gotoGoodsDetail" :showNumBox="false" :showRadio="false" :goods="goodsList"></my-goods>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 商品列表请求参数
				goodsSearch: {
					query: "",
					cid: "",
					pagenum: 1,
					pagesize: 10,
					total: "",
				},
				goodsList: [],
				isLoding: false,
				title: "没有更多数据啦"
			};
		},
		onLoad(options) {
			// 把跳转页面时url中传的参数赋值给商品列表请求参数
			this.goodsSearch.query = options.query || "";
			this.goodsSearch.cid = options.goods_id || "";
			// 进入页面调用获取商品列表方法
			this.getGoodsListData();
		},
		methods: {
			// 获取列表数据方法
			async getGoodsListData(callback) {
				// 设置加载节流阀为true，代表开始加载数据了
				this.isLoding = true;
				// 发起请求
				const {
					data: res
				} = await uni.$http.get("/api/public/v1/goods/search", this.goodsSearch)
				// 这里的写法相当于 判断callback是否接收到实参了，如果传参了，就调用这个方法，如果没有就不调用
				// 传来的callback这个方法是用来停止下拉刷新状态的，代表刷新后数据重新获取完成，停止下拉刷新状态
				callback && callback();
				// 判断数据是否获取失败，如果获取失败了，就弹框提示用户数据获取失败
				if (res.meta.status !== 200) return uni.$toast();
				// 把原有的数据和获取到的数据结构到一个新的数组中，然后赋值给goodsList
				this.goodsList = [...this.goodsList, ...res.message.goods]
				// 把获取到的商品的总数存到data中
				this.goodsSearch.total = res.message.total
				// 设置加载节流阀为false，代表数据加载完成了
				this.isLoding = false;
			},
			// 商品列表组件调用父组件的方法
			gotoGoodsDetail(goods_id) {
				// 跳转到商品详情页
				uni.navigateTo({
					url: '../goods_detail/goods_detail?goods_id=' + goods_id
				})
			}
		},
		// 上拉获取数据方法
		onReachBottom() {
			// 判断如果正在执行上拉方法，就不能继续执行这个方法，必须要等本次数据获取完成后才能继续调用此方法
			if (this.isLoding) return
			// 使用 当前页码 * 每页多少条数据 >= 商品总数 的公式来判断是否已经加载了所有商品，如果所有商品都加载完毕了，就return
			if (this.goodsSearch.pagenum * this.goodsSearch.pagesize >= this.goodsSearch.total) return uni.$toast(this
				.title)
			// 每次下拉的时候让当前页码+1，然后再次调用获取列表数据方法，这样就可以获取到下一页的数据了
			this.goodsSearch.pagenum += 1;
			this.getGoodsListData();
		},
		// 下拉刷新
		onPullDownRefresh() {
			// 下拉刷新的时候把所有的东西全部重置
			this.goodsSearch.pagenum = 1;
			this.goodsSearch.total = 0
			this.isloading = false
			this.goodsList = []
			// 调用获取数据方法，把停止下拉刷新状态的方法传给获取数据方法
			this.getGoodsListData(() => uni.stopPullDownRefresh());
		}
	}
</script>

<style lang="scss">

</style>
