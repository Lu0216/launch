import request from '@/utils/request'
// 子账号列表
export function getSubList(params) {
    return request({
      url: 'api/media/account/child/list',
      method: 'post',
      data:params
    })
}

// 子账号-新增
export function addSub(params) {
    return request({
      url: '/api/media/account/child/add',
      method: 'post',
      data: params
    })
}
  

// 子账号-编辑
export function editSub(params) {
    return request({
      url: '/api/media/account/child/edit/'+params.media_id,
      method: 'post',
      data: params
    })
}

// 子账号-下载
export function subDownload(params) {
    return request({
      url: '/api/media/account/child/download',
      method: 'post',
      headers:{
        'Content-Type':'application/x-www-form-urlencoded'
      },
      data: params
    })
}

// 子账号-批量添加
export function addSubMore(params) {
  return request({
    url: '/api/media/account/child/batch',
    method: 'post',
    headers:{
    'Content-Type':'multipart/form-data'
    },
    data: params
  })
}
  

// 子账号-批量修改子账号状态
export function statusSub(params) {
  return request({
    url: '/api/media/account/child/status',
    method: 'post',
    data: params
  })
}

// 获取上传模板
export function getTemplateLink(params) {
  return request({
    url: '/api/media/account/getTemplateLink',
    method: 'post',
    data: params
  })
}
