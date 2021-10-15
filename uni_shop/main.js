import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

// 1. 引入uniapp请求方法
import {
	$http
} from '@escook/request-miniprogram'
// 2. 把uniapp二次添加到uniapp的顶级对象中
uni.$http = $http
// 3. 配置默认请求地址
$http.baseUrl = 'https://www.uinav.com'

App.mpType = 'app'

// 4. 请求开始之前做一些事情
$http.beforeRequest = function(options) {
	// do somethimg...
	uni.showLoading({
		title: '加载中...'
	});
}

// 5. 请求完成之后做一些事情
$http.afterRequest = function() {
	uni.hideLoading()
}

uni.$toast = function(title = "数据获取失败", duration = 1500) {
	uni.showToast({
		title,
		duration,
		icon: 'none',
	})
}

import store from "./store"

const app = new Vue({
	...App,
	store
})
app.$mount()
