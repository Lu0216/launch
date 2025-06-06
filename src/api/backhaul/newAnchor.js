import request from '@/utils/request'

// 新回传锚点gap配置管理 -- 列表
export function getList(params) {
    return request({
      url: '/api/backhaul/activateV3/list',
      method: 'post',
      data:params
    })
}

// 新回传锚点gap配置管理 -- 新增
export function getAdd(params) {
    return request({
      url: '/api/backhaul/activateV3/saveV2',
      method: 'post',
      data:params
    })
}

// 新回传锚点gap配置管理 -- 编辑
export function getEdit(params) {
    return request({
      url: `/api/backhaul/activateV3/edit`,
      method: 'post',
      data:params
    })
}

// 新回传锚点gap配置管理 -- 批量编辑
export function getBatchEdit(params) {
  return request({
    url: '/api/backhaul/activateV3/edit',
    method: 'post',
    data: params
  })
}


