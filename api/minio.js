import request from '@/utils/requestUtil'
import { API_BASE_URL} from '@/utils/appConfig.js';


// 添加头像上传接口
export function uploadPortrait(filePath) {
  const token = uni.getStorageSync('token');
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: API_BASE_URL + '/minio/upload',
      filePath: filePath,
      name: 'file',
      header: {
        'Authorization': token
      },
      success: (res) => {
        const data = JSON.parse(res.data);
        if (res.statusCode === 200 && data.code === 200) {
          resolve(data.data);
        } else {
          reject(data.message || '上传失败');
        }
      },
      fail: (err) => {
        reject('上传失败: ' + err.errMsg);
      }
    });
  });
  }