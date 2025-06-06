import request from '@/utils/request'

// 营收报表
export function getList(params) {
  return request({
    url: '/api/report/revenue/list',
    method: 'post',
    data: params
  })
}