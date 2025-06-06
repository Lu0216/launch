import request from '@/utils/request'

// 快应用关键行为 -- 列表
export function getList(params) {
    return request({
      url: '/api/quickapp/activate/list',
      method: 'post',
      data:params
    })
}

// 快应用关键行为 -- 新增
export function getAdd(params) {
    return request({
      url: '/api/quickapp/activate/saveV2',
      method: 'post',
      data:params
    })
}

// 快应用关键行为 -- 编辑
export function getEdit(params) {
    return request({
      url: `/api/quickapp/activate/edit`,
      method: 'post',
      data:params
    })
}

// 快应用关键行为 -- 批量编辑
export function getBatchEdit(params) {
  return request({
    url: '/api/quickapp/activate/edit',
    method: 'post',
    data: params
  })
}


