export default {
	namespaced: true,
	state: {
		cart: JSON.parse(uni.getStorageSync("cart") || "[]")
	},
	mutations: {
		// 添加商品方法
		addCart(state, payload) {
			// 使用find方法查找state.cart中有没有要添加的这个商品，如果有就吧这个商品保存到变量中
			const findResult = state.cart.find(item => item.goods_id === payload.goods_id)
			// console.log(findResult)

			// 如果没有这个商品了就把这个商品添加到state.cart中
			if (!findResult) {
				state.cart.push(payload)
			} else {
				// 如果有这个商品了就让商品的总数量++
				findResult.goods_count++
			}
		},

		// 将购物车中的数据持久化存储到本地
		saveToStorage(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},
		// 切换购物车中radio的选中和不选中
		changeRadio(state, payload) {
			// 使用find方法找到点击按钮的商品
			let findResult = state.cart.find(item => item.goods_id === payload.goods_id)
			// 判断是否找到这个商品了
			if (findResult) {
				// 如果找到了就把这个商品的goods_state属性切换为相反值
				findResult.goods_state = !payload.goods_state;
			}
		},
		// 切换购物车中numBox中的数字
		changeNumBox(state, payload) {
			// 使用find方法找到点击按钮的商品
			let findResult = state.cart.find(item => item.goods_id === payload.goods_id)
			// 判断是否找到这个商品了
			if (findResult) {
				// 如果找到了就把这个商品的goods_count=传来的值
				findResult.goods_count = payload.goods_count;
			}
		},
		// 这个方法是重新给cart赋值，这个方法是在购物车页面中商品右滑后点击删除调用这个方法
		changeCartList(state, payload) {
			state.cart = payload
		},
		changeAllGoodsState(state, newState) {
			state.cart.forEach(item => item.goods_state = newState)
		}
	},
	actions: {
		// 这里mutations中的所有方法都在actions中调用，符合官方文档写法
		useAddCart(state, payload) {
			state.commit("addCart", payload)
		},
		useSaveToStorage(state) {
			state.commit("saveToStorage")
		},
		useChangeRadio(state, payload) {
			state.commit("changeRadio", payload)
		},
		useChangeNumBox(state, payload) {
			state.commit("changeNumBox", payload)
		},
		useChangeCartList(state, payload) {
			state.commit("changeCartList", payload)
		},
		useChangeAllGoodsState(state,payload) {
			state.commit("changeAllGoodsState", payload)
		}
	},
	getters: {
		// 使用getters监听商品总数的变化
		total(state) {
			// 定义一个初始值
			let count = 0;
			// 循环遍历每个商品的中的goods_count属性，把goods_count的值循环加到定义的变量中
			state.cart.forEach(item => count += item.goods_count)
			// 返回变量
			return count
		},
		// 监听购物车中被选中的商品的总数量
		checkedCount(state) {
			return state.cart.filter(item => item.goods_state).reduce((totle,item) => totle+=item.goods_count,0)
		},
		// 监听购物车中所有商品价钱的总和
		price(state) {
			return state.cart.filter(item => item.goods_state).reduce((totle,item) => totle+=item.goods_price*item.goods_count,0)
		}
	}
}
