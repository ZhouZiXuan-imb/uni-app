<template>
	<view>
    <!-- 用户未登录时，显示登录组件 -->
    <my-login v-if="!token"></my-login>

    <!-- 用户登录后，显示用户信息组件 -->
    <my-userinfo v-else></my-userinfo>
	</view>
</template>

<script>
	// 引入mixin页面
	import tabBarBadge from "../../mixin/tabbar-badge.js.js"
	
	import { mapState } from "vuex"
	
	export default {
		mixins: [tabBarBadge],
		data() {
			return {

			}
		},
		computed:{
			...mapState("storeUserAddress",["token"])
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
