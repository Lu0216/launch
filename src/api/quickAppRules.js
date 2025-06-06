import request from '@/utils/request'

// 快应用回传锚点gap配置管理 -- 列表
export function getList(params) {
    return request({
      url: '/api/quickapp/behavior/list',
      method: 'post',
      data:params
    })
}

// 快应用回传锚点gap配置管理 -- 新增
export function getAdd(params) {
    return request({
      url: '/api/quickapp/behavior/saveV2',
      method: 'post',
      data:params
    })
}

// 快应用传锚点gap配置管理 -- 编辑
export function getEdit(params) {
    return request({
      url: `/api/quickapp/behavior/edit`,
      method: 'post',
      data:params
    })
}

// 快应用回传锚点gap配置管理 -- 批量编辑
export function getBatchEdit(params) {
  return request({
    url: '/api/quickapp/behavior/edit',
    method: 'post',
    data: params
  })
}


