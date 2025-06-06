import request from '@/utils/request'

// 获取产品列表
export function getList() {
  return request({
    url: '/base/getProd',
    method: 'post'
  })
}
// 获取当前用户的权限列表
export function getUserme(params) {
  return request({
    url: '/permission/me',
    method: 'get',
    data: params
  })
}
