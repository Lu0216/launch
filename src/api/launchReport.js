import request from '@/utils/request'

// 投放报表
export function getList(params) {
  return request({
    url: '/api/report/delivery/list',
    method: 'post',
    data: params
  })
}

// 投放报表 新增品牌、版本维度
export function getLists(params) {
  return request({
    url: '/api/report/deliverybymodel/list',
    method: 'post',
    data: params
  })
}