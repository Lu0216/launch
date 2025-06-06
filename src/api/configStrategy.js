import request from '@/utils/request'

// 激活锚点修改记录
export function getAnchorList(params) {
  return request({
    url: '/api/backhaul/activate/records',
    method: 'post',
    data: params
  })
}

// 关键行为修改记录
export function getBehaviorList(params) {
  return request({
    url: '/api/custom_rule/records',
    method: 'post',
    data: params
  })
}