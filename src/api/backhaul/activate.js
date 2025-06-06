import request from '@/utils/request'

// 列表
export function getActivateList(params) {
    return request({
      url: '/api/backhaul/activate/list',
      method: 'post',
      data:params
    })
}

// 新增
export function addActivate(params) {
    return request({
      url: '/api/backhaul/activate/add',
      method: 'post',
      data: params
    })
}
// 批量编辑
export function editActivate(params) {
  return request({
    url: '/api/backhaul/activate/edit',
    method: 'post',
    data: params
  })
}
  

// 批量删除
export function deleteActivate(params) {
    return request({
      url: '/api/backhaul/activate/delete',
      method: 'post',
      data: params
    })
}

// 新增多条 重复覆盖
export function saveActive(params) {
  return request({
    url:'/api/backhaul/activate/saveV2',
    method:'post',
    data:params
  })
}

  