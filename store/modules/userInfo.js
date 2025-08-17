 import {updateMemberInfo,memberInfo} from '@/api/member.js'; 
 
 const state = ()=>({
		hasLogin: false,
		userInfo: {},
	})

 const mutations = {
		login(state, provider) {

			state.hasLogin = true;
			state.userInfo = provider;
			console.log("m_login:",provider)
			uni.setStorage({//缓存用户登陆状态
			    key: 'userInfo',  
			    data: provider  
			}) 
		},
		logout(state) {
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({  
                key: 'userInfo'  
            });
			uni.removeStorage({
			    key: 'token'  
			})
		},
		updateUserInfo(state, userInfo) {
			state.userInfo = { ...state.userInfo, ...userInfo };
			uni.setStorage({//缓存用户登陆状态
			    key: 'userInfo',  
			    data: state.userInfo  
			}) 
		}
	}
const actions={
	   async updateMemberInfoAction({commit},userData){
		   try{
			   const response =  await updateMemberInfo(userData);
			   const infoResponse = await memberInfo();
			   commit("updateUserInfo",infoResponse.data)
		   }catch(error){
			   console.log("更新失败");
			   throw error;
		   }
	   }
	}
	
export default {
  namespaced: true,
  state,
  mutations,
  actions
}