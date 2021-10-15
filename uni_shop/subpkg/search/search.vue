<template>
	<view>
		<!-- 1.搜索框组件 -->
		<view class="my-search-box">
			<uni-search-bar @input="setSearchContent" :radius="100" cancelButton="none"></uni-search-bar>
		</view>
		
		
		<!-- 2.搜索建议列表 -->
		<view class="sugg-list" v-if="searchData.length !== 0">
			<view class="sugg-item" v-for="(item,index) in searchData" :key="index"
				@click="gotoGoodsDetail(item.goods_id)">
				<view class="goods-name">{{item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>


		<!-- 3.搜索历史 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="clearSearchHistory"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag :text="item" v-for="(item, i) in historys" :key="i" @click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 把定时器初始化
				timer: null,
				inputValue: "",
				searchData: [],
				historyList: [],
			};
		},
		onLoad() {
			// 每次进入页面的时候，把保存在本地的搜索历史数据获取到，如果本地没有数据，就把空数组赋值给historyList
			this.historyList = JSON.parse(uni.getStorageSync("historys") || '[]');
		},
		methods: {
			// 设置搜索建议列表方法
			setSearchContent(e) {
				// 每次调用方法都要先清除当前定时器，如果不清除定时器，会重复调用此方法
				clearTimeout(this.timer);
				// 每次设置建议列表的时候，都要清空当前列表中的数据
				this.searchData = [];
				// 声明定时器
				this.timer = setTimeout(() => {
					// 把搜索框中输入的内容存储到data中
					this.inputValue = e.value
					// 调用获取 搜索建议列表 方法
					this.getSearchContent();
				}, 500)
				// 把搜索的内容添加到 historyList(搜索历史) 中
				this.historyList.push(this.inputValue)
				// --------------------------------------
				// 这样写是为了清除搜索历史中重复的数据
				// 把搜索历史中的数据转换为set对象
				const set = new Set(this.historyList);
				// 使用delete方法，删除搜索历史中所有当前所有的这个商品的名称
				set.delete(this.inputValue);
				// 然后再使用add方法把当前搜索添加到搜索历史中
				set.add(this.inputValue);
				// --------------------------------------
				// 我们处理完重复数据后，就把这个set对象再次转换成一个数据，赋值给historyList(搜索历史)
				this.historyList = Array.from(set)
				// 把data中存储的搜索历史数据保存到本地存储
				uni.setStorageSync("historys",JSON.stringify(this.historyList));
			},
			// 发起请求获取搜索内容
			async getSearchContent() {
				// 发起请求
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/qsearch', {
					query: this.inputValue
				});
				// 判断如果数据获取失败，就弹出框提示用户数据获取失败
				if (res.meta.status !== 200) return uni.$toast();
				// 把获取到的数据存储到searchData
				this.searchData = res.message;
			},
			// 点击商品推荐信息
			gotoGoodsList(goods_name) {
				console.log(goods_name)
				// 点击历史搜索标签，跳转到商品列表页
				uni.navigateTo({
					url: "../goods_list/goods_list?query=" + goods_name
				})
			},
			// 点击搜索建议列表
			gotoGoodsDetail(goods_id) {
				// 跳转到商品详情页
				uni.navigateTo({
					url: '../goods_detail/goods_detail?goods_id=' + goods_id
				})
			},
			// 点击清除历史搜索按钮清空历史搜索
			clearSearchHistory() {
				// 点击清空搜索历史按钮清空本地存储的搜索历史数据
				uni.clearStorage("historys");
				// 再清除data中存储的搜索历史数据
				this.historyList = [];
			}
		},
		computed: {
			// 使用计算属性把搜索历史数据顺序反转
			historys() {
				return [...this.historyList].reverse();
			}
		}
	}
</script>

<style lang="scss">
	.sugg-list {
		padding: 0 5px;

		.sugg-item {
			font-size: 12px;
			padding: 13px 0;
			border-bottom: 1px solid #efefef;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.goods-name {
				// 文字不允许换行（单行文本）
				white-space: nowrap;
				// 溢出部分隐藏
				overflow: hidden;
				// 文本溢出后，使用 ... 代替
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}	

	.history-box {
		padding: 0 5px;

		.history-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40px;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}

		.history-list {
			display: flex;
			flex-wrap: wrap;

			.uni-tag {
				margin-top: 5px;
				margin-right: 5px;
			}
		}
	}
</style>
