import Vue from 'vue'
import Vuex from 'vuex'
import pageStack from './modules/pageStack'
import userInfo from './modules/userInfo'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
	    userInfo,
	    pageStack
	}
})

export default store
