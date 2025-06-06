import request from '@/utils/request'

// 列表
export function getScreenList(params) {
    return request({
      url: '/api/backhaul/screen/list',
      method: 'post',
      data:params
    })
}

// 新增
export function addScreen(params) {
    return request({
      url: '/api/backhaul/screen/add',
      method: 'post',
      data: params
    })
}
  

// 编辑
export function editScreen(params) {
    return request({
      url: '/api/backhaul/screen/edit',
      method: 'post',
      data: params
    })
}

// 批量添加
export function batchScreen(params) {
    return request({
      url: '/api/backhaul/screen/batch',
      method: 'post',
      data: params
    })
}

// 搜索
export function searchScreen(params) {
  return request({
    url: '/api/backhaul/screen/search',
    method: 'get',
    params
  })
}

// 批量删除
export function deleteScreen(params) {
  return request({
    url: '/api/backhaul/screen/delete',
    method: 'post',
    data: params
  })
}