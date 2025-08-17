import request from '@/utils/requestUtil'

export function fetchNotices() {
	return request({
		method: 'GET',
		url: '/notice/list',
	})
}