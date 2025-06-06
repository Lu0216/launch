import request from '@/utils/request'

// 用户列表
export function getUserList(params) {
    return request({
      url: '/api/user/getList',
      method: 'post',
      data:params
    })
}

// 编辑账号
export function saveUser(params) {
    return request({
      url: '/api/user/save',
      method: 'post',
      data: params
    })
}

// 删除用户
export function deleteUser(params) {
    return request({
      url: '/api/user/delete',
      method: 'post',
      data: params
    })
}