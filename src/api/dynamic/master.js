import request from '@/utils/request'

// 主账号列表
export function getAccountList(params) {
  return request({
    url: '/api/media/account/list',
    method: 'post',
    data:params
  })
}

// 主账号-新增
export function addAccount(params) {
  return request({
    url: '/api/media/account/add',
    method: 'post',
    data: params
  })
}


// 主账号-编辑
export function editAccount(params) {
  return request({
    url: '/api/media/account/edit/'+params.id,
    method: 'post',
    data: params
  })
}

// 主账号-新增
export function AccountDownload(params) {
  return request({
    url: '/api/media/account/download',
    method: 'post',
    headers:{
      'Content-Type':'application/x-www-form-urlencoded'
    },
    data: params
  })
}

