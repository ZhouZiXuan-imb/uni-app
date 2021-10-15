import Vue from 'vue';
import Vuex from "vuex";

Vue.use(Vuex);

import storeCart from "./storeCart"
import storeUserAddress from "./storeUserAddress.js"

const store = new Vuex.Store({
	modules:{
		storeCart,
		storeUserAddress
	},
})

export default store