export default {
	namespaced: true,
	state: {
		address: JSON.parse(uni.getStorageSync("address") || "{}"),
		token:"",
		userinfo: JSON.parse(uni.getStorageSync("userinfo") || "{}"),
	},
	mutations: {
		// 当用选择了收货地址后，使用这个方法把选择的地址保存在vuex的address属性中
		setAddress(state, payload) {
			state.address = payload
			console.log(state.address)
		},
		// 把用户的地址保存到本地
		saveUserAddressToStore(state) {
			uni.setStorageSync("address",JSON.stringify(state.address))
		},
		setUserInfo(state,userInfo) {
			state.userinfo = userInfo
			console.log(state.userinfo)
		}
	},
	actions: {
		useSetAddress(state, payload) {
			state.commit("setAddress", payload)
			state.commit("saveUserAddressToStore")
		},
		useSetUserInfo(state,payload) {
			state.commit("setUserInfo", payload)
		}
	},
	getters:{
		addStr(state) {
			if(state.address.provinceName) {
				return `${state.address.provinceName} ${state.address.cityName} ${state.address.countyName} ${state.address.detailInfo}`
			} else {
				return 
			}
		}
	}
}
