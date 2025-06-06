import request from '@/utils/request'

// 列表
export function getExceptionList(params) {
    return request({
      url: '/api/backhaul/exception/list',
      method: 'post',
      data:params
    })
}

// 新增
export function addException(params) {
    return request({
      url: '/api/backhaul/exception/add',
      method: 'post',
      data: params
    })
}
// 编辑
export function editException(params) {
  return request({
    url: '/api/backhaul/exception/edit',
    method: 'post',
    data: params
  })
}
  

// 删除
export function deleteException(params) {
    return request({
      url: '/api/backhaul/exception/delete',
      method: 'post',
      data: params
    })
} 
