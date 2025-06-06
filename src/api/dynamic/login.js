import request from '@/utils/request'
// 登录
export function login(params) {
    return request({
      url: '/api/user/ldaplogin',
      method: 'post',
      data:params
    })
}

export function getInfo() {
  return request({
    url: '/api/permission/me',
    method: 'get'
  })
}