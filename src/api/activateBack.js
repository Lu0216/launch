import request from '@/utils/request'

/**
 * 
 * 子账户回传管理
 */

// 子账户回传管理列表
export function getList(params) {
  return request({
    url: '/api/anchor/advertis/list',
    method: 'post',
    data: params
  })
}

// 子账户回传管理---激活回传场景下拉
export function getActBackList(params) {
  return request({
    url: '/api/anchor/list',
    method: 'get',
    params,
  })
}


// 子账户回传管理 --新增
export function getSubAdd(params) {
    console.log(params,'---params')
  return request({
    url: '/api/anchor/advertis/add',
    method: 'post',
    data: params
  })
}

// 子账户回传管理 --删除
export function getSubDelete(params) {
  return request({
    url: '/api/anchor/advertis/delete',
    method: 'post',
    data: params
  })
}

/**
 * 
 * 媒体回传场景
 */

// 媒体回传场景  --列表页
export function getMediaBackList(params) {
  return request({
    url: '/api/anchor/media/list',
    method: 'post',
    data: params
  })
}

// 媒体回传场景  --新增
export function getMediaAdd(params) {
  return request({
    url: '/api/anchor/media/add',
    method: 'post',
    data: params
  })
}

// 媒体回传场景  --删除
export function getMediaDelete(params) {
  return request({
    url: '/api/anchor/media/delete',
    method: 'post',
    data: params
  })
}
