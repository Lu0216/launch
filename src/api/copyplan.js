import request from '@/utils/request'

// 计划纬度列表
export function getList(params) {
  return request({
    url: '/api/copy_unit/list',
    method: 'post',
    data: params
  })
}