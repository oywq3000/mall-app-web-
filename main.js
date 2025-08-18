import Vue from 'vue'
import store from './store'
import App from './App'


const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}

const prePage = ()=>{
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}

// 监听页面跳转
uni.addInterceptor('navigateTo', {
  invoke(res) {
    const path = res.url.split('?')[0];
    store.commit('pageStack/PUSH_PAGE', path);
  }
});

uni.addInterceptor('navigateBack', {
  success() {
    store.commit('pageStack/POP_PAGE');
  }
});

// 监听返回主页的导航事件（假设主页路径为/pages/index/index）
uni.addInterceptor('reLaunch', {
  invoke(options) {
    const path = options.url.split('?')[0];
    // 匹配主页路径时清空页面栈
    if (path === '/pages/index/index') {
      store.commit('pageStack/CLEAR_PAGE_STACK');
    }
  }
});

// 如果使用redirectTo返回主页，也可以添加对应拦截器
uni.addInterceptor('redirectTo', {
  invoke(options) {
    const path = options.url.split('?')[0];
    if (path === '/pages/index/index') {
      store.commit('pageStack/CLEAR_PAGE_STACK');
    }
  }
});



Vue.config.productionTip = false
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = {msg, prePage};

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()