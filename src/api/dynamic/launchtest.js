import request from '@/utils/request'

// 列表
export function getDetectionList(params) {
    return request({
      url: '/api/putDetection/list',
      method: 'post',
      data:params
    })
}

// 激活回传
export function doDetection(params) {
    return request({
      url: '/api/putDetection/doDetection',
      method: 'post',
      data:params
    })
}



