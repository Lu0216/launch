import request from '@/utils/request'

// 列表
export function getAuthList(params) {
    return request({
      url: '/api/reportAuthInfo/list',
      method: 'post',
      data:params
    })
}

// 添加
export function addAuth(params) {
    return request({
      url: '/api/reportAuthInfo/add',
      method: 'post',
      data:params
    })
}

// 编辑
export function editAuth(params) {
    return request({
      url: '/api/reportAuthInfo/edit',
      method: 'post',
      data:params
    })
}


