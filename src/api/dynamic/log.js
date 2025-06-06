import request from '@/utils/request'

// 联调日志
export function getRecordList(params) {
    return request({
      url: '/api/putDetection/getDetectionRecord',
      method: 'post',
      data:params
    })
}



