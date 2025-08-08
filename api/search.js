import request from '@/utils/requestUtil'


export function searchProducts(params) {
	return request({
		method: 'GET',
		url: '/search/search',
		params: params
	})
}

export function searchHistorys() {
	return request({
		method: 'GET',
		url: '/search/history',
	})
}

export function deleteHistory(params) {
	return request({
		method: 'POST',
		url: '/search/delete',
		params: params
	})
}
